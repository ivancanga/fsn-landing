import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const checkWinner = async (
  onWinnerRedirect: () => void // Redirección como callback
): Promise<void> => {
  try {
    const docRef = doc(db, "games", "current");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.winner && data.winner !== "") {
        onWinnerRedirect(); // Llama a la función de redirección si hay un ganador
      }
    } else {
      console.error("El documento 'current' no existe en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar el ganador:", error);
  }
};
