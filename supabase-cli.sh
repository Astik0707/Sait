#!/bin/bash
# Скрипт для работы с Supabase через терминал

# Загружаем переменные окружения
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Проверяем наличие переменных
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase credentials not found in .env.local"
    exit 1
fi

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SUPABASE_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Функция для получения всех объектов
get_properties() {
    echo "📋 Получение объектов из Supabase..."
    curl -s \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/properties?select=*&order=created_at.desc" \
        | jq '.' 2>/dev/null || curl -s \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/properties?select=*&order=created_at.desc"
}

# Функция для получения одного объекта по ID
get_property() {
    if [ -z "$1" ]; then
        echo "❌ Укажите ID объекта"
        echo "Использование: ./supabase-cli.sh get <id>"
        exit 1
    fi
    echo "📋 Получение объекта $1..."
    curl -s \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/properties?id=eq.$1&select=*" \
        | jq '.' 2>/dev/null || curl -s \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/properties?id=eq.$1&select=*"
}

# Функция для подсчета объектов
count_properties() {
    echo "📊 Подсчет объектов..."
    curl -s \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Prefer: count=exact" \
        "$SUPABASE_URL/rest/v1/properties?select=id" \
        | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0"
}

# Функция для удаления объекта
delete_property() {
    if [ -z "$1" ]; then
        echo "❌ Укажите ID объекта для удаления"
        echo "Использование: ./supabase-cli.sh delete <id>"
        exit 1
    fi
    
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        echo "❌ SUPABASE_SERVICE_ROLE_KEY не найден. Удаление требует service role key."
        exit 1
    fi
    
    echo "🗑️  Удаление объекта $1..."
    curl -s -X DELETE \
        -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        "$SUPABASE_URL/rest/v1/properties?id=eq.$1"
    echo "✅ Объект удален"
}

# Главное меню
case "$1" in
    list|get)
        if [ "$1" = "list" ]; then
            get_properties
        else
            get_property "$2"
        fi
        ;;
    count)
        count_properties
        ;;
    delete)
        delete_property "$2"
        ;;
    *)
        echo "📦 Supabase CLI для Pach Group"
        echo ""
        echo "Использование:"
        echo "  ./supabase-cli.sh list              - Получить все объекты"
        echo "  ./supabase-cli.sh get <id>          - Получить объект по ID"
        echo "  ./supabase-cli.sh count             - Подсчитать объекты"
        echo "  ./supabase-cli.sh delete <id>       - Удалить объект (требует service role key)"
        echo ""
        echo "Примеры:"
        echo "  ./supabase-cli.sh list"
        echo "  ./supabase-cli.sh get 11a8c9ce-163f-4a23-885f-445f8b7f799e"
        echo "  ./supabase-cli.sh count"
        ;;
esac

