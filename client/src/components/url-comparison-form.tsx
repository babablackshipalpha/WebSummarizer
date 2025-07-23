import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ComparisonResult } from "@shared/schema";

const formSchema = z.object({
  url1: z.string().url("Please enter a valid URL for first website"),
  url2: z.string().url("Please enter a valid URL for second website"),
  includeTraditionalSeo: z.boolean().default(true),
  includeGeo: z.boolean().default(true),
  includeContentSuggestions: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface UrlComparisonFormProps {
  onComparisonStart: (url1: string, url2: string) => void;
  onComparisonComplete: (result: ComparisonResult) => void;
  onComparisonError: () => void;
}

export default function UrlComparisonForm({ 
  onComparisonStart, 
  onComparisonComplete, 
  onComparisonError 
}: UrlComparisonFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url1: "",
      url2: "",
      includeTraditionalSeo: true,
      includeGeo: true,
      includeContentSuggestions: true,
    },
  });

  const compareWebsites = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/compare", data);
      return response.json() as Promise<ComparisonResult>;
    },
    onSuccess: (result) => {
      onComparisonComplete(result);
      toast({
        title: "Comparison Complete",
        description: "Website comparison has been completed successfully.",
      });
    },
    onError: (error) => {
      onComparisonError();
      toast({
        title: "Comparison Failed",
        description: error instanceof Error ? error.message : "Failed to compare websites",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    onComparisonStart(data.url1, data.url2);
    compareWebsites.mutate(data);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="text-primary mr-3 h-5 w-5" />
          <h2 className="text-lg font-semibold text-slate-900">Website Comparison</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Compare two websites to see which one performs better in SEO and AI visibility
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Website URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example1.com"
                        className="font-mono text-sm"
                        disabled={compareWebsites.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Website URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example2.com"
                        className="font-mono text-sm"
                        disabled={compareWebsites.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <FormField
                control={form.control}
                name="includeTraditionalSeo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={compareWebsites.isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-600">Traditional SEO</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeGeo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={compareWebsites.isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-600">AI Optimization</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeContentSuggestions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={compareWebsites.isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-600">Content Analysis</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-blue-700"
                disabled={compareWebsites.isPending}
              >
                <Search className="mr-2 h-4 w-4" />
                {compareWebsites.isPending ? "Comparing..." : "Compare Websites"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}