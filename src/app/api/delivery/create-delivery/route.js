import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongoDB";

export async function POST(request) {

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const body = await request.json();

        const delivery = await db
            .collection("deliveries")
            .insertOne(body);

        return NextResponse.json({ success: true, data: delivery });
    } catch (error) {
        console.error("Error creating delivery:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
