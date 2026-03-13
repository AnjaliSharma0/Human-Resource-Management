export const redirectByRole = (role:string) => {

  if(role === "admin") return "/admin/dashboard";

  if(role === "manager") return "/manager/dashboard";

  return "/employees/dashboard";

};