import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany();

    // Check if we have any assets
    if (assets.length === 0) {
      // Return empty dataset to prevent frontend errors
      return NextResponse.json([
        { month: 'Jan', total: 0 },
        { month: 'Feb', total: 0 },
        { month: 'Mar', total: 0 },
        { month: 'Apr', total: 0 },
        { month: 'May', total: 0 },
        { month: 'Jun', total: 0 },
        { month: 'Jul', total: 0 },
        { month: 'Aug', total: 0 },
        { month: 'Sep', total: 0 },
        { month: 'Oct', total: 0 },
        { month: 'Nov', total: 0 },
        { month: 'Dec', total: 0 },
      ]);
    }

    // Aggregate purchasePrice by month
    const monthlyData = Array(12).fill(0);
    
    assets.forEach(asset => {
      if (asset.purchaseDate) {
        const month = new Date(asset.purchaseDate).getMonth();
        monthlyData[month] += Number(asset.purchasePrice) || 0;
      }
    });

    const formattedData = monthlyData.map((total, index) => ({
      month: new Date(2025, index, 1).toLocaleString('default', { month: 'short' }),
      total,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}