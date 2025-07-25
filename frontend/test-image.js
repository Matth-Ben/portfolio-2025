// Script de test pour vérifier la structure des images Strapi
const STRAPI_URL = 'http://localhost:1337';

async function testImageStructure() {
  console.log('🧪 Test de la structure des images Strapi');
  console.log('URL:', STRAPI_URL);
  console.log('---');

  try {
    // Test 1: Récupération de la page avec populate=deep
    console.log('1️⃣ Test avec populate=deep...');
    const response = await fetch(`${STRAPI_URL}/api/pages?filters[title][$eq]=Accueil&populate=deep`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   OK:', response.ok);
    
    if (data.data && data.data.length > 0) {
      const page = data.data[0];
      console.log('   Page trouvée:', page.title);
      
      if (page.sections && page.sections.length > 0) {
        console.log('   Sections trouvées:', page.sections.length);
        
        page.sections.forEach((section, index) => {
          console.log(`   Section ${index + 1}:`, {
            component: section.__component,
            id: section.id,
            title: section.title,
            hasBackgroundImage: !!section.backgroundImage,
            backgroundImageData: section.backgroundImage
          });
        });
      } else {
        console.log('   ⚠️  Aucune section trouvée');
      }
    } else {
      console.log('   ⚠️  Aucune page trouvée');
    }

    // Test 2: Test direct de l'API Media
    console.log('\n2️⃣ Test de l\'API Media...');
    const mediaResponse = await fetch(`${STRAPI_URL}/api/upload/files`);
    
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      console.log('   Nombre d\'images dans Media Library:', mediaData.length);
      
      if (mediaData.length > 0) {
        console.log('   Première image:', {
          id: mediaData[0].id,
          name: mediaData[0].name,
          url: mediaData[0].url,
          formats: Object.keys(mediaData[0].formats || {})
        });
      }
    } else {
      console.log('   ❌ Erreur Media API:', mediaResponse.status);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter le test
testImageStructure(); 