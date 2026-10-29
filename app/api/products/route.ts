
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";



export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("axstore");

    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Could not fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

    const price = Number(body.price);
    const stock = Number(body.stock);

    if (
      !name ||
      !description ||
      !category ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid product details." },
        { status: 400 }
      );
    }

    if (
      imageUrl &&
      (!imageUrl.startsWith("https://") ||
        imageUrl.length > 2048)
    ) {
      return NextResponse.json(
        { success: false, message: "Image URL must use HTTPS." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("axstore");

    const result = await db.collection("products").insertOne({
      name,
      description,
      category,
      price,
      stock,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product saved successfully.",
        productId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Could not create product." },
      { status: 500 }
    );
  }
}
