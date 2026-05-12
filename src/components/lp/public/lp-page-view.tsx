import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { LpDynamicForm } from "./lp-dynamic-form";
import type { FormFieldConfig } from "@/lib/lp/types";

type Props = {
  id: string;
  bannerUrl: string | null;
  formFields: FormFieldConfig[];
};

export function LpPageView({ id, bannerUrl, formFields }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {bannerUrl && (
        <div className="relative h-48 w-full sm:h-64 md:h-80 lg:h-96">
          <Image
            src={bannerUrl}
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <LpDynamicForm
              landingPageId={id}
              formFields={formFields}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
