export const markAsReturned = async (
  id: number
): Promise<{ ok: boolean; data: any }> => {
  const response = await fetch(`/api/items/${id}/return`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      returned: true,
    }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

export const unreturn = async (
  id: number
): Promise<{ ok: boolean; data: any }> => {
  const response = await fetch(`/api/items/${id}/return`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      returned: false,
    }),
  });

  const data = await response.json();

  return { ok: response.ok, data: data };
};
