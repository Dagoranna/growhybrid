const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type purchaseProps = {
  userId: number | null;
  itemName: string;
  count: number;
};

export async function makeHash(data: string | number) {
  const encoder = new TextEncoder();
  const secretKey = process.env.NEXTAUTH_SECRET as string;
  const encodedData = encoder.encode(secretKey + data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);

  const hashArray = new Uint8Array(hashBuffer);
  const base64Hash = Array.from(hashArray)
    .map((byte) => String.fromCharCode(byte))
    .join("");

  return btoa(base64Hash);
}

export function removeItemFromArray<T>(arr: T[], item: T) {
  return arr.filter((el) => el !== item);
}

export function serverMessageHandling(data: unknown) {
  console.log("external handling => " + data);
}

export async function getPrice(item_name: string) {
  const response = await fetch(`${apiUrl}/api/base/getPrice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_name: item_name }),
  });

  try {
    const baseResponse = await response.json();
    return Number(baseResponse.message);
  } catch {
    return null;
  }
}

export async function getMoney(userId: number) {
  const response = await fetch(`${apiUrl}/api/base/getMoney`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner_id: userId }),
  });

  const baseResponse = await response.json();
  return baseResponse.message;
}

export async function makePurchase(
  userId: number | null,
  itemName: string,
  count: number
) {
  const response = await fetch(`${apiUrl}/api/base/makePurchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, itemName, count }),
  });

  const baseResponse = await response.json();
  return baseResponse;
}
