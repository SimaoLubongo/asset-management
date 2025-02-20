import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();
        const res = await client.query("SELECT NOW()");
        await client.end();
        return NextResponse.json({ success: true, message: "Successful connection!", timestamp: res.rows[0].now });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message: "Error connecting", error: errorMessage });
    }
}
