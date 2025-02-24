import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
 
// GET asset by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
   
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Asset ID is required" },
        { status: 400 }
      );
    }
   
    const asset = await prisma.asset.findUnique({
      where: { id }
    });
   
    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }
   
    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
 
// UPDATE asset by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Get the ID from the route params
 
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Asset ID is required" },
        { status: 400 }
      );
    }
 
    const data = await req.json(); // Get the data from the request body
 
    // Check if data is empty
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "No data to update provided" },
        { status: 400 }
      );
    }
 
    // Convert string number fields to numbers
    if (data.purchasePrice) {
      data.purchasePrice = parseFloat(data.purchasePrice);
    }
    if (data.depreciation) {
      data.depreciation = parseFloat(data.depreciation);
    }
    if (data.disposeValue) {
      data.disposeValue = parseFloat(data.disposeValue);
    }
 
    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: data // Update with the provided data
    });
 
    return NextResponse.json({ success: true, data: updatedAsset });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// DELETE asset by ID
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
  
      if (!id) {
        return NextResponse.json(
          { success: false, error: "Asset ID is required" },
          { status: 400 }
        );
      }
  
      // Find the asset before deleting
      const asset = await prisma.asset.findUnique({
        where: { id },
      });
  
      if (!asset) {
        return NextResponse.json(
          { success: false, error: "Asset not found" },
          { status: 404 }
        );
      }
  
      // Delete the asset
      await prisma.asset.delete({
        where: { id },
      });
  
      return NextResponse.json({
        success: true,
        message: "Asset deleted successfully",
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
  