export interface Wine {
  id: bigint;
  name: string;
  type: string;
  price: number;
  description: string;
  imageFile: File | null;
  imageData: ArrayBuffer | null;
  fileBytes: any;
  imageUrl: any;
}


