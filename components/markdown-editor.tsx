"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="write" className="mt-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your lesson content in markdown...

## Example Heading
- Bullet point
- Another point

**Bold text** and *italic text*

```code block```"
          rows={15}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Supports markdown formatting: headings, lists, bold, italic, code blocks, and more
        </p>
      </TabsContent>

      <TabsContent value="preview" className="mt-2">
        <div className="min-h-[300px] p-4 border border-border rounded-md bg-card">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{value || "*No content yet. Start writing in the Write tab.*"}</ReactMarkdown>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}




