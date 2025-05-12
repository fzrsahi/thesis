"use client";

import Forbidden from "next/error";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ForbiddenPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Forbidden statusCode={403} title="Anda Tidak Berhak Dapat Mengakses Halaman Ini" />
    </div>
  );
};

export default ForbiddenPage;
