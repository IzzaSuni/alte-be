export type createUserParams = {
  email: string;
  password: string;
  fullname: string;
  nim: number;
  angkatan: number;
  created_at: string;
  role: string;
};
export type updatePasswordParams = {
  email: string;
  password: string;
};
export type productParams = {
  product_name: string;
  warna: string;
  harga: number;
  ukuran: string;
  deskripsi: string;
  kategori: string;
  picture: string;
  terjual: number;
  featured: boolean;
};
export type transactionParams = {
  nama: string;
  alamat: string;
  warna: string;
  ukuran: string;
  jumlah: number;
  harga: number;
  product_id: number;
  status: string;
  user_id: number;
};
export type updateUserParams = {
  email: string;
  password: string;
  phone: string;
  username: string;
  refreshToken: string;
};
export type loginParam = {
  email: string;
  password: string;
};

export type Transaction = {
  user_id: number;
  product_id: number;
  alamat: number;
  jumlah: number;
  harga_total: string;
  status: string;
  warna: string;
  ukuran: string;
};

export type Product = {
  user_id: string;
  product_name: string;
  warna: number;
  harga: number;
  ukuran: string;
  kategori: string;
};
