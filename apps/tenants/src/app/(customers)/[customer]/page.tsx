import {publicRequestFetch} from "@meetfaq/tenants/src/helpers/get.api.key";
import {Category} from "@prisma/client";
import {textToMarkdown} from "@meetfaq/tenants/src/helpers/text.to.markdown";
import Link from "next/link";
import {Suspense} from "react";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = 'force-static';

type Props = {
  params: { customer: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const {customer} = params;
  const {name} = await publicRequestFetch(customer);

  return {
    title: name + ' FAQ'
  }
}

export default async function Page({params: {customer}} : {params: {customer: string}}) {
  const {tags, request} = await publicRequestFetch(customer);
  const {data} = await request.get(`/public/categories?c=${customer}`, {cache: 'force-cache', next: {tags: [tags]}});

  return (
    <Suspense>
      <div className="flex flex-col gap-6">
          {data.map((category: Category & {slug: string}) => (
            <Link href={`/categories/${category.slug}`}
                 key={category.id}
                 className="min-h-[126px] border border-gray rounded-container p-5 shadow-lg hover:shadow-xl transition-all secondaryColor">
                  <div className="font-bold mb-2">
                    {category.name}
                  </div>
                  <div dangerouslySetInnerHTML={{__html: textToMarkdown(category.description)}} />
            </Link>
          ))}
      </div>
    </Suspense>
  )
}
