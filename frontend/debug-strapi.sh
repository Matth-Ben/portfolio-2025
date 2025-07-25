#!/bin/bash

echo "🔍 Debug de la connexion Strapi depuis le conteneur Astro"
echo "=================================================="

# Test de connectivité réseau
echo "1️⃣ Test de connectivité réseau..."
echo "   Ping vers strapi:1337..."
if ping -c 1 strapi > /dev/null 2>&1; then
    echo "   ✅ Host strapi accessible"
else
    echo "   ❌ Host strapi inaccessible"
fi

# Test de port
echo "2️⃣ Test de port..."
echo "   Test de connexion TCP vers strapi:1337..."
if nc -z strapi 1337 2>/dev/null; then
    echo "   ✅ Port 1337 ouvert sur strapi"
else
    echo "   ❌ Port 1337 fermé sur strapi"
fi

# Test HTTP
echo "3️⃣ Test HTTP..."
echo "   Test de l'API Strapi..."
if curl -s -o /dev/null -w "%{http_code}" http://strapi:1337/api/healthcheck | grep -q "200"; then
    echo "   ✅ API Strapi répond"
else
    echo "   ❌ API Strapi ne répond pas"
fi

# Variables d'environnement
echo "4️⃣ Variables d'environnement..."
echo "   STRAPI_URL: $STRAPI_URL"
echo "   NODE_ENV: $NODE_ENV"

echo "=================================================="
echo "Debug terminé" 