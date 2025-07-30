import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Test de l'API Strapi avec l'endpoint public
    const response = await fetch('http://localhost:1337/api/home?populate=*');
    
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'Erreur Strapi',
        status: response.status,
        statusText: response.statusText
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      data: data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Erreur de connexion',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 