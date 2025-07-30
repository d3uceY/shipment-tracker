import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongoDB";

export async function GET() {

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);


        const delivery = await db
            .collection("deliveries")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ success: true, data: delivery });
    } catch (error) {
        console.error("Error fetching user delivery:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
