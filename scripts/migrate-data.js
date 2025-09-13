const { MongoClient } = require("mongodb");

async function migrateProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "fortune_info_solutions");
    const products = db.collection("products");

    console.log("Migrating products...");

    // Step 1: Move `image` into `images` array
    const result1 = await products.updateMany(
      { image: { $exists: true, $type: "string" } },
      [
        { $set: { images: ["$image"] } },
        { $unset: "image" },
      ]
    );

    console.log(`Updated ${result1.modifiedCount} products with images`);

    // Step 2: Ensure every product has `images` (even empty array if not provided)
    const result2 = await products.updateMany(
      { images: { $exists: false } },
      { $set: { images: [] } }
    );

    console.log(`Added empty images array to ${result2.modifiedCount} products`);

    console.log("✅ Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.close();
  }
}

migrateProducts();
