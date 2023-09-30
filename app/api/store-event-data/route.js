import path from "node:path";
import { Web3Storage, getFilesFromPath } from "web3.storage";

export async function POST(request) {
  const body = await request.json();

  try {
    const files = await makeFileObjects(body);
    const cid = await storeFiles(files);

    return Response.json({ success: true, cid });
  } catch (error) {
    return Response.json({ error: "Error creating event." }, { status: 500 });
  }
}

async function makeFileObjects(body) {
  const buffer = Buffer.from(JSON.stringify(body));

  const imagePath = path.resolve(process.cwd(), `public/images/${body.image}`);

  const files = await getFilesFromPath(imagePath);
  files.push(new File([buffer], "data.json"));

  return files;
}

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
}

async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  return cid;
}
