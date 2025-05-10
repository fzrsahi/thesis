export type BreadcrumbItem = {
  href: string;
  label: string;
  isLast: boolean;
};

export const getBreadcrumbItems = (path: string): BreadcrumbItem[] => {
  const paths = path.split("/").filter(Boolean);
  const items = paths.map((segment, index) => {
    const href = `/${paths.slice(0, index + 1).join("/")}`;
    let label;
    switch (segment) {
      case "dashboard":
        label = "Dasbor";
        break;
      case "student":
        label = "Mahasiswa";
        break;
      case "recomendation":
        label = "Rekomendasi";
        break;
      case "settings":
        label = "Pengaturan";
        break;
      default:
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }

    return {
      href,
      label,
      isLast: index === paths.length - 1,
    };
  });

  return items;
};
