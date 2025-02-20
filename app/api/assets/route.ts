import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all assets
export async function GET() {
    try {
        const assets = await prisma.asset.findMany();
        return NextResponse.json({ success: true, data: assets });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// POST a new asset
export async function POST(req: Request) {
    try {
        const { title, manufacturer, color, serialNumber, purchasePrice, depreciation, disposeValue, assignedTo } = await req.json();

        if (!title || !manufacturer || !color || !serialNumber || !purchasePrice || !depreciation || !disposeValue || !assignedTo) {
            return NextResponse.json({ success: false, error: "All fields are mandatory" }, { status: 400 });
        }

        const newAsset = await prisma.asset.create({
            data: { title, manufacturer, color, serialNumber, purchasePrice: parseFloat(purchasePrice), depreciation: parseFloat(depreciation), disposeValue: parseFloat(disposeValue), assignedTo }
        });

        return NextResponse.json({ success: true, data: newAsset });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// PUT (update) an asset by ID 
export async function PUT(req: Request) {
    try {
        const { id, title, manufacturer, color, serialNumber, purchasePrice, depreciation, disposeValue, assignedTo } = await req.json();

        if (!id || !title || !manufacturer || !color || !serialNumber || !purchasePrice || !depreciation || !disposeValue || !assignedTo) {
            return NextResponse.json({ success: false, error: "All fields are mandatory" }, { status: 400 });
        }

        const updatedAsset = await prisma.asset.update({
            where: { id },
            data: { title, manufacturer, color, serialNumber, purchasePrice: parseFloat(purchasePrice), depreciation: parseFloat(depreciation), disposeValue: parseFloat(disposeValue), assignedTo }
        });

        return NextResponse.json({ success: true, data: updatedAsset });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// DELETE an asset by ID
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "Asset ID is required" }, { status: 400 });
        }

        await prisma.asset.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Asset deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}