export function extractApiError(err: unknown): string {
    // Network / CORS / DNS
    if (typeof err === "object" && err && "message" in err && err.message === "Network Error") {
      return "Sin conexión con el servidor";
    }
  
    // Axios con response
    const maybeAxios = err as any;
    if (maybeAxios?.response?.data) {
      const data = maybeAxios.response.data;
      return (
        data.message ||               // Nest / Express -> { message: "..." }
        data.error ||                 // { error: "..." }
        JSON.stringify(data)          // fallback: muestra JSON bruto
      );
    }
  
    // Algo inesperado
    return (err as any)?.message ?? "Error desconocido";
  }
  