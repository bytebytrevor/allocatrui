import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar28 } from "@/components/DatePicker";
import api from "@/api/axios";

type Props = {
  projectId: string;
  trigger: React.ReactNode;
  onCreated?: () => void;
};

export default function CreateTaskDialog({ projectId, trigger, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formData = new FormData(e.currentTarget);

  //   await api.post(
  //     `/projects/tasks/${projectId}`,
  //     {
  //       title: formData.get("title"),
  //       description: formData.get("description"),
  //       priority: formData.get("priority"),
  //       dueDate: formData.get("dueDate"),
  //     },
  //     { withCredentials: true }
  //   );

  //   setLoading(false);
  //   onCreated?.();
  // }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) {
      console.error("Missing projectId");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await api.post(
      `/projects/tasks/${projectId}`,
      {
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        // dueDate: formData.get("dueDate"),
        dueDate: new Date(),
      },
      { withCredentials: true }
    );

    setLoading(false);
    onCreated?.();
  }


  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="min-w-sm">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Add a new task to this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>

          {/* <div className="grid gap-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Calendar28 id="dueDate" />
          </div> */}

          <div className="grid gap-2">
            <Label>Priority</Label>
            <div className="flex gap-4">
              {["standard", "high", "urgent"].map(p => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="priority" value={p} defaultChecked={p === "standard"} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
