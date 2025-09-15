// /f:/ByteWise Consulting/fortune-info-solution/app/products/loading.js

export default async function loader() {
  // Simulate loading delay and fetch products (replace with real fetch logic)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Example: return an empty array or mock data
  return { products: [] };
}
