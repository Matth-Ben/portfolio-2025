# Script de développement pour Windows
Write-Host "🚀 Démarrage de l'environnement de développement..." -ForegroundColor Green

# Arrêter les conteneurs existants
Write-Host "🛑 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down

# Nettoyer
Write-Host "🧹 Nettoyage..." -ForegroundColor Yellow
docker-compose rm -f
docker system prune -f

# Reconstruire et démarrer
Write-Host "🔨 Reconstruction et démarrage..." -ForegroundColor Green
docker-compose up --build

# Alternative pour développement local (plus rapide)
# Write-Host "💡 Pour un développement plus rapide, utilisez: cd frontend && npm run dev" -ForegroundColor Cyan 