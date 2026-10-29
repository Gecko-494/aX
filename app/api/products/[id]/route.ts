
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "stock",
      "imageUrl",
    ];

    const suppliedFields = Object.keys(body);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid product fields." },
        { status: 400 }
      );
    }

    const update: Record<string, string | number | Date> = {};

    for (const field of ["name", "description", "category"] as const) {
      if (field in body) {
        if (
          typeof body[field] !== "string" ||
          !body[field].trim()
        ) {
          return NextResponse.json(
            { success: false, message: `Invalid ${field}.` },
            { status: 400 }
          );
        }

        update[field] = body[field].trim();
      }
    }

    if ("price" in body) {
      const price = Number(body.price);

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid price." },
          { status: 400 }
        );
      }

      update.price = price;
    }

    if ("stock" in body) {
      const stock = Number(body.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid stock." },
          { status: 400 }
        );
      }

      update.stock = stock;
    }

    if ("imageUrl" in body) {
      if (
        typeof body.imageUrl !== "string" ||
        (body.imageUrl !== "" &&
          (!body.imageUrl.startsWith("https://") ||
            body.imageUrl.length > 2048))
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid image URL." },
          { status: 400 }
        );
      }

      update.imageUrl = body.imageUrl.trim();
    }

    update.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db("axstore");

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Could not update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("axstore");

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Could not delete product." },
      { status: 500 }
    );
  }
}
