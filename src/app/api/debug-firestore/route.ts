import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const apps = getApps();
const app = apps.length === 0
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  : apps[0];

const db = getFirestore(app);

export async function GET() {
  try {
    console.log('🔍 Checking Firestore collections...');
    
    // Check products collection
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Check for prices in each product
    const productsWithPrices = await Promise.all(
      productsSnapshot.docs.map(async (productDoc) => {
        const pricesSnapshot = await productDoc.ref.collection('prices').get();
        const prices = pricesSnapshot.docs.map(priceDoc => ({
          id: priceDoc.id,
          ...priceDoc.data()
        }));
        
        return {
          id: productDoc.id,
          data: productDoc.data(),
          prices
        };
      })
    );
    
    // Check customers collection
    const customersSnapshot = await db.collection('customers').get();
    
    return NextResponse.json({
      success: true,
      collections: {
        products: {
          count: productsSnapshot.size,
          items: productsWithPrices
        },
        customers: {
          count: customersSnapshot.size
        }
      },
      message: productsSnapshot.size === 0 
        ? '⚠️ No products found! Products have not synced from Stripe.' 
        : '✅ Products found in Firestore!'
    });
    
  } catch (error: any) {
    console.error('❌ Error checking Firestore:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      collections: null
    }, { status: 500 });
  }
}