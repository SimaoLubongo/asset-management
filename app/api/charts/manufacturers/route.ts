import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all assets with manufacturer information
    const assets = await prisma.asset.findMany({
      select: {
        manufacturer: true,
      },
      where: {
        manufacturer: {
          not: null,
          not: '',
        }
      }
    });

    // If no assets, return empty array
    if (assets.length === 0) {
      return NextResponse.json([]);
    }

    // Count assets by manufacturer
    const manufacturerCounts = {};
    
    assets.forEach(asset => {
      const manufacturer = asset.manufacturer || 'Unknown';
      manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1;
    });

    // Convert to array format for PieChart
    const formattedData = Object.entries(manufacturerCounts).map(([name, count]) => ({
      name,
      value: count,
    }));

    // Sort by count (descending)
    formattedData.sort((a, b) => b.value - a.value);

    // Limit to top 7 manufacturers if there are many
    const topManufacturers = formattedData.slice(0, 7);
    
    // If there are more than 7, add an "Others" category
    if (formattedData.length > 7) {
      const othersSum = formattedData.slice(7).reduce((sum, item) => sum + item.value, 0);
      if (othersSum > 0) {
        topManufacturers.push({
          name: 'Others',
          value: othersSum
        });
      }
    }

    return NextResponse.json(topManufacturers);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch manufacturer data' }, { status: 500 });
  }
}