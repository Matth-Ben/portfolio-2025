// Script de test pour vérifier la connexion API Strapi
const STRAPI_URL = process.env.STRAPI_URL || 'http://strapi:1337';

async function testStrapiAPI() {
  console.log('🧪 Test de connexion API Strapi');
  console.log('URL:', STRAPI_URL);
  console.log('---');

  try {
    // Test 1: Vérifier si Strapi répond
    console.log('1️⃣ Test de base...');
    const healthResponse = await fetch(`${STRAPI_URL}/api/healthcheck`);
    console.log('   Status:', healthResponse.status);
    console.log('   OK:', healthResponse.ok);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   Données:', healthData);
    }

    // Test 2: Lister toutes les pages
    console.log('\n2️⃣ Test de récupération des pages...');
    const pagesResponse = await fetch(`${STRAPI_URL}/api/pages?populate=*`);
    console.log('   Status:', pagesResponse.status);
    console.log('   OK:', pagesResponse.ok);
    
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      console.log('   Nombre de pages:', pagesData.data?.length || 0);
      if (pagesData.data && pagesData.data.length > 0) {
        console.log('   Pages disponibles:');
        pagesData.data.forEach((page, index) => {
          console.log(`     ${index + 1}. ${page.attributes.title} (ID: ${page.id})`);
        });
      }
    }

    // Test 3: Rechercher la page "Accueil"
    console.log('\n3️⃣ Test de recherche page "Accueil"...');
    const accueilResponse = await fetch(`${STRAPI_URL}/api/pages?filters[title][$eq]=Accueil&populate=*`);
    console.log('   Status:', accueilResponse.status);
    console.log('   OK:', accueilResponse.ok);
    
    if (accueilResponse.ok) {
      const accueilData = await accueilResponse.json();
      console.log('   Nombre de résultats:', accueilData.data?.length || 0);
      if (accueilData.data && accueilData.data.length > 0) {
        console.log('   Page trouvée:', accueilData.data[0].attributes);
      } else {
        console.log('   ⚠️  Aucune page "Accueil" trouvée');
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('   Cause:', error.cause);
  }
}

// Exécuter le test
testStrapiAPI(); 