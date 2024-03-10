import { redirect } from "next/navigation";

export function notFound(){
    redirect("/page-not-found")
}