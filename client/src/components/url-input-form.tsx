import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AuditReport } from "@shared/schema";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  includeTraditionalSeo: z.boolean().default(true),
  includeGeo: z.boolean().default(true),
  includeContentSuggestions: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface UrlInputFormProps {
  onAnalysisStart: (url: string) => void;
  onAnalysisComplete: (report: AuditReport) => void;
  onAnalysisError: () => void;
}

export default function UrlInputForm({ onAnalysisStart, onAnalysisComplete, onAnalysisError }: UrlInputFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      includeTraditionalSeo: true,
      includeGeo: true,
      includeContentSuggestions: true,
    },
  });

  const analyzeWebsite = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json() as Promise<AuditReport>;
    },
    onSuccess: (report) => {
      onAnalysisComplete(report);
      toast({
        title: "Analysis Complete",
        description: "Website audit has been completed successfully.",
      });
    },
    onError: (error) => {
      onAnalysisError();
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    onAnalysisStart(data.url);
    analyzeWebsite.mutate(data);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Globe className="text-primary mr-3 h-5 w-5" />
          <h2 className="text-lg font-semibold text-slate-900">Website Analysis</h2>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example.com"
                        className="font-mono text-sm"
                        disabled={analyzeWebsite.isPending}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-500">Enter the complete URL including https://</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:pt-7">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-primary text-white hover:bg-blue-700"
                  disabled={analyzeWebsite.isPending}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {analyzeWebsite.isPending ? "Analyzing..." : "Analyze Website"}
                </Button>
              </div>
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
                        disabled={analyzeWebsite.isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-600">Traditional SEO Audit</FormLabel>
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
                        disabled={analyzeWebsite.isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-600">GEO (AI Optimization)</FormLabel>
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
                        disabled={analyzeWebsite.isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-600">Content Recommendations</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
