// Category data structure for dynamic category pages
import tomatoKetchup from '@/assets/Tomato-Ketchup.png';
import tomatoSauce from '@/assets/Tomato-Sauce.png';
import snackSauce from '@/assets/Snack-Sauce.png';
import greenChilliSauce from '@/assets/Green-Chilli-Sauce.png';
import redChilliSauce from '@/assets/Red-Chilli-Sauce.png';
import soyaSauce from '@/assets/Soya-Sauce.png';
import vinegar from '@/assets/Vinegar.png';
import hotSpicySauce from '@/assets/Hot-&-Spicy-Sauce.png';
import garlicSauce from '@/assets/Garlic-Sauce.png';
import schezwanSauce from '@/assets/Schezwan-Sauce.png';
import liteMayonnaise from '@/assets/Lite-Mayonnaise.png';
import classicMayonnaise from '@/assets/Classic-Mayonnaise.png';
import cheeseBlend from '@/assets/Cheese-Blend.png';
import periPeriSauce from '@/assets/Peri-Peri-Sauce.png';
import romescoSauce from '@/assets/Romesco-Sauce.png';
import sambalSauce from '@/assets/Sambal-Sauce.png';
import greenChilliFlakes from '@/assets/Green-Chilli-Flakes.png';
import greenChilliPowder from '@/assets/Green-Chilli-Powder.png';
import yelkahiBananaPowder from '@/assets/Yelkahi-Banana-Powde.png';
import rasabaleBananaPowder from '@/assets/Rasabale-Banana-Powder.png';
import g9BananaPowder from '@/assets/G9-Banana-Powder.png';
import rawPapayaPowder from '@/assets/Raw-Papaya-Powder.png';
import mangoPowder from '@/assets/Mango-Powder.png';
import guavaPowder from '@/assets/Guava-Powder.png';
import sweetPotatoPowder from '@/assets/Sweet-Potato-Powder.png';
import chikooSapotaPowder from '@/assets/Chikoo(Sapota)-Powder.png';
// Using Cloudinary hosted video for better performance and reduced storage
const heroSauceVideo = 'https://res.cloudinary.com/dzwaccyfv/video/upload/v1/hero-sauce_nzhlln.mp4';
import heroSaucePoster from '@/assets/hero-sauce.jpg';

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  shortDescription: string;
  badge?: string;
  price?: number;
}

export interface Category {
  slug: string;
  title: string;
  tagline: string;
  video: string;
  videoPoster: string;
  products: Product[];
}

export const categoryData: Category[] = [
  {
    slug: 'sauces-condiments',
    title: 'Sauces & Condiments',
    tagline: 'Premium sauces crafted for exceptional taste and quality',
    video: heroSauceVideo,
    videoPoster: heroSaucePoster,
    products: [
      {
        id: 'tomato-ketchup',
        name: 'Tomato Ketchup',
        slug: 'tomato-ketchup',
        image: tomatoKetchup,
        shortDescription: 'Classic tomato ketchup made from ripe, high-quality tomatoes, blended with a balanced mix of spices for rich flavor and smooth texture.',
        badge: 'Bestseller'
      },
      {
        id: 'tomato-sauce-continental',
        name: 'Tomato Sauce / Continental Sauce',
        slug: 'tomato-sauce-continental',
        image: tomatoSauce,
        shortDescription: 'A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes.'
      },
      {
        id: 'snack-sauce',
        name: 'Snack Sauce',
        slug: 'snack-sauce',
        image: snackSauce,
        shortDescription: 'A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors.'
      },
      {
        id: 'green-chilli-sauce',
        name: 'Green Chilli Sauce',
        slug: 'green-chilli-sauce',
        image: greenChilliSauce,
        shortDescription: 'Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma.'
      },
      {
        id: 'red-chilli-sauce',
        name: 'Red Chilli Sauce',
        slug: 'red-chilli-sauce',
        image: redChilliSauce,
        shortDescription: 'Fiery red chili sauce with rich color and intense flavor for spicy food lovers.'
      },
      {
        id: 'soya-sauce',
        name: 'Soya Sauce',
        slug: 'soya-sauce',
        image: soyaSauce,
        shortDescription: 'Fermented soy-based sauce delivering deep umami flavor for Asian cuisines.'
      },
      {
        id: 'vinegar',
        name: 'Vinegar',
        slug: 'vinegar',
        image: vinegar,
        shortDescription: 'Naturally fermented vinegar for culinary and health applications.'
      },
      {
        id: 'hot-spicy-sauce',
        name: 'Hot & Spicy Sauce',
        slug: 'hot-spicy-sauce',
        image: hotSpicySauce,
        shortDescription: 'A powerful blend of chilies and spices for intense heat lovers.',
        badge: 'Hot'
      },
      {
        id: 'garlic-sauce',
        name: 'Garlic Sauce',
        slug: 'garlic-sauce',
        image: garlicSauce,
        shortDescription: 'Creamy garlic-based sauce with bold aroma and savory richness.'
      },
      {
        id: 'schezwan-sauce',
        name: 'Schezwan Sauce',
        slug: 'schezwan-sauce',
        image: schezwanSauce,
        shortDescription: 'Spicy Indo-Chinese sauce made with red chilies, garlic, and spices.'
      },
      {
        id: 'lite-mayonnaise',
        name: 'Lite Mayonnaise',
        slug: 'lite-mayonnaise',
        image: liteMayonnaise,
        shortDescription: 'Low-fat creamy mayonnaise with smooth texture and mild flavor.'
      },
      {
        id: 'classic-mayonnaise',
        name: 'Classic Mayonnaise',
        slug: 'classic-mayonnaise',
        image: classicMayonnaise,
        shortDescription: 'Rich, creamy mayonnaise made from premium oils and eggs.',
        badge: 'Bestseller'
      },
      {
        id: 'cheese-blend',
        name: 'Cheese Blend',
        slug: 'cheese-blend',
        image: cheeseBlend,
        shortDescription: 'Creamy cheese-flavored sauce for rich, savory dishes.'
      },
      {
        id: 'peri-peri-sauce',
        name: 'Peri Peri Sauce',
        slug: 'peri-peri-sauce',
        image: periPeriSauce,
        shortDescription: 'Tangy, spicy African-style sauce made with bird\'s eye chilies.',
        badge: 'Hot'
      },
      {
        id: 'romesco-sauce',
        name: 'Romesco Sauce',
        slug: 'romesco-sauce',
        image: romescoSauce,
        shortDescription: 'Spanish-style nutty tomato-based sauce with rich smoky flavor.',
        badge: 'Premium'
      },
      {
        id: 'sambal-sauce',
        name: 'Sambal Sauce',
        slug: 'sambal-sauce',
        image: sambalSauce,
        shortDescription: 'Indonesian-style chili sauce with bold spice and tangy notes.'
      }
    ]
  },
  {
    slug: 'flakes-powders',
    title: 'Flakes & Powders (Agro Products)',
    tagline: 'Premium dried flakes and powders for authentic flavor',
    video: heroSauceVideo,
    videoPoster: heroSaucePoster,
    products: [
      {
        id: 'green-chilli-flakes',
        name: 'Green Chilli Flakes',
        slug: 'green-chilli-flakes',
        image: greenChilliFlakes,
        shortDescription: 'Dried green chilies crushed into flakes for bold heat and aroma.',
        badge: 'Popular'
      },
      {
        id: 'green-chilli-powder',
        name: 'Green Chilli Powder',
        slug: 'green-chilli-powder',
        image: greenChilliPowder,
        shortDescription: 'Finely ground green chili powder with intense flavor.'
      }
    ]
  },
  {
    slug: 'banana-powders',
    title: 'Raw Banana Powders',
    tagline: 'Nutritious banana powders from premium varieties',
    video: heroSauceVideo,
    videoPoster: heroSaucePoster,
    products: [
      {
        id: 'yelkahi-banana-powder',
        name: 'Yelkahi Banana Powder',
        slug: 'yelkahi-banana-powder',
        image: yelkahiBananaPowder,
        shortDescription: 'Made from premium Yelkahi bananas grown near Tungabhadra River.',
        badge: 'Premium'
      },
      {
        id: 'rasabale-banana-powder',
        name: 'Rasabale Banana Powder',
        slug: 'rasabale-banana-powder',
        image: rasabaleBananaPowder,
        shortDescription: 'Powdered aromatic bananas from Cauvery river belt.'
      },
      {
        id: 'g9-banana-powder',
        name: 'G9 Banana Powder',
        slug: 'g9-banana-powder',
        image: g9BananaPowder,
        shortDescription: 'Powder made from export-grade Grand Naine bananas.'
      }
    ]
  },
  {
    slug: 'fruit-vegetable-powders',
    title: 'Fruit & Vegetable Powders',
    tagline: 'Natural nutrition in every spoonful',
    video: heroSauceVideo,
    videoPoster: heroSaucePoster,
    products: [
      {
        id: 'raw-papaya-powder',
        name: 'Raw Papaya Powder',
        slug: 'raw-papaya-powder',
        image: rawPapayaPowder,
        shortDescription: 'Unripe papaya powder rich in papain enzyme.'
      },
      {
        id: 'mango-powder',
        name: 'Mango Powder',
        slug: 'mango-powder',
        image: mangoPowder,
        shortDescription: 'Naturally sweet mango powder from ripe mangoes.',
        badge: 'Organic'
      },
      {
        id: 'guava-powder',
        name: 'Guava Powder',
        slug: 'guava-powder',
        image: guavaPowder,
        shortDescription: 'Powdered guava rich in fiber and antioxidants.'
      },
      {
        id: 'sweet-potato-powder',
        name: 'Sweet Potato Powder',
        slug: 'sweet-potato-powder',
        image: sweetPotatoPowder,
        shortDescription: 'Naturally sweet powder made from dried sweet potatoes.'
      },
      {
        id: 'chikoo-sapota-powder',
        name: 'Chikoo (Sapota) Powder',
        slug: 'chikoo-sapota-powder',
        image: chikooSapotaPowder,
        shortDescription: 'Sweet, nutrient-rich sapota powder.'
      }
    ]
  }
];
