import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Eye, Pencil, Trash2,
  Library, BookOpen, Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { libraryApi } from "@/api/libraryApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { formatDate, formatCurrency } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";
import { studentApi } from '@/api/studentApi';

export default function LibraryPage () {
  const { isAdmin } = useAuthStore();
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Library"
          subtitle="Manage books, issues and returns"
       />
       <Tabs defaultValue={defaultTab}>
         <TabsList>
           <TabsTrigger value="books">Books</TabsTrigger>
           <TabsTrigger value="issues">Issued Books</TabsTrigger>
           <TabsTrigger value="overdue">Overdue</TabsTrigger>
           <TabsTrigger value="fines">Fines</TabsTrigger>
         </TabsList>
         <TabsContent value="books"> <BooksTab/> </TabsContent>
         <TabsContent value="issues"> <IssuesTab/> </TabsContent>
         <TabsContent value="overdue"> <OverdueTab/> </TabsContent>
         <TabsContent value="fines"> <FinesTab/> </TabsContent>
       </Tabs>
     </div>
  );
}

// ── Books Tab ─────────────────────────────────────────────────────────────────
function BooksTab () {
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [available, setAvailable] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getBooks({
        page, size,
        search: debouncedSearch || undefined,
        available: available || undefined,
      });
      setBooks(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch books"); } finally { setLoading(false); }
  }, [page, size, debouncedSearch, available]);
  
  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { reset(); }, [debouncedSearch, available]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await libraryApi.deleteBook(deleteId);
      toast.success("Book deleted");
      setDeleteId(null);
      fetchBooks();
    } catch { toast.error("Failed to delete book"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search by title, author, ISBN..."
                        className="flex-1 min-w-[200px]"/>
             <Select value={available} onValueChange={setAvailable}>
               <SelectTrigger className="w-40">
                 <SelectValue placeholder="Availability"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Books</SelectItem>
                 <SelectItem value="true">Available</SelectItem>
                 <SelectItem value="false">Not Available</SelectItem>
               </SelectContent>
             </Select>
             {isAdmin && (
                <Button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Book
                </Button>
             )}
             {(search || available) && (
                <Button variant="outline"
                        onClick={() => {
                          setSearch("");
                          setAvailable("");
                        }}>
                  Clear
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       {/* Books Grid */}
       {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
               <Skeleton key={i} className="h-52 rounded-xl"/>
            ))}
          </div>
       ) : books.length === 0 ? (
          <EmptyState icon={Library} title="No books found"
                      description="Add books to the library to get started."
                      action={isAdmin && (
                         <Button onClick={() => setShowForm(true)}
                                 className="bg-blue-600 hover:bg-blue-700">
                           <Plus className="w-4 h-4 mr-2"/> Add Book
                         </Button>
                      )}
          />
       ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {books.map((book) => (
                 <BookCard
                    key={book.id}
                    book={book}
                    canEdit={isAdmin}
                    onEdit={() => {
                      setEditBook(book);
                      setShowForm(true);
                    }}
                    onDelete={() => setDeleteId(book.id)}
                 />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages}
                        total={total} size={size} onPageChange={setPage}/>
          </>
       )}
       
       <BookFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditBook(null);
          }}
          editData={editBook}
          onSuccess={() => {
            setShowForm(false);
            setEditBook(null);
            fetchBooks();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Book"
                      description="Are you sure you want to delete this book?"
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Book Card ─────────────────────────────────────────────────────────────────
function BookCard ({ book, canEdit, onEdit, onDelete }) {
  return (
     <Card className="hover:shadow-md transition-shadow">
       <CardContent className="p-5">
         <div className="flex items-start justify-between mb-3">
           <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20">
             <BookOpen className="w-6 h-6 text-blue-600"/>
           </div>
           <div className="flex items-center gap-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
               book.availableCopies > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
            }`}>
              {book.availableCopies > 0 ? "Available" : "Unavailable"}
            </span>
           </div>
         </div>
         
         <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 line-clamp-2">
           {book.title}
         </h3>
         <p className="text-xs text-muted-foreground mb-1">{book.author}</p>
         {book.isbn && (
            <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
         )}
         
         <div className="flex items-center justify-between mt-3 pt-3 border-t">
           <div className="text-xs text-muted-foreground">
            <span className="font-medium text-gray-900 dark:text-white">
              {book.availableCopies}
            </span>/{book.totalCopies} copies
           </div>
           {canEdit && (
              <div className="flex gap-1">
                <button onClick={onEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                  <Pencil className="w-3.5 h-3.5"/>
                </button>
                <button onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
           )}
         </div>
       </CardContent>
     </Card>
  );
}

// ── Issues Tab ────────────────────────────────────────────────────────────────
function IssuesTab () {
  const { isAdmin, isTeacher } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showIssue, setShowIssue] = useState(false);
  const [returning, setReturning] = useState(null);
  
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getIssues({
        page, size,
        status: status || undefined,
      });
      setIssues(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch issues"); } finally { setLoading(false); }
  }, [page, size, status]);
  
  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  useEffect(() => { reset(); }, [status]);
  
  const handleReturn = async (id) => {
    setReturning(id);
    try {
      await libraryApi.returnBook(id);
      toast.success("Book returned successfully");
      fetchIssues();
    } catch { toast.error("Failed to return book"); } finally { setReturning(null); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       <div className="flex flex-wrap gap-3">
         <Select value={status} onValueChange={setStatus}>
           <SelectTrigger className="w-40">
             <SelectValue placeholder="All Status"/>
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All</SelectItem>
             <SelectItem value="ISSUED">Issued</SelectItem>
             <SelectItem value="RETURNED">Returned</SelectItem>
           </SelectContent>
         </Select>
         {(isAdmin || isTeacher) && (
            <Button onClick={() => setShowIssue(true)}
                    className="bg-blue-600 hover:bg-blue-700 ml-auto">
              <Plus className="w-4 h-4 mr-2"/> Issue Book
            </Button>
         )}
       </div>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={6}/> :
              issues.length === 0 ? (
                 <EmptyState icon={BookOpen} title="No issues found"/>
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Book</th>
                         <th className="text-left px-4 py-3 font-medium">Student</th>
                         <th className="text-left px-4 py-3 font-medium">Issue Date</th>
                         <th className="text-left px-4 py-3 font-medium">Due Date</th>
                         <th className="text-left px-4 py-3 font-medium">Return Date</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {issues.map((issue) => (
                          <tr key={issue.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 font-medium">{issue.bookTitle}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {issue.studentName}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDate(issue.issueDate)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDate(issue.dueDate)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {issue.returnDate ? formatDate(issue.returnDate) : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={issue.status}/>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                {issue.status === "ISSUED" && (isAdmin || isTeacher) && (
                                   <Button
                                      size="sm" variant="outline"
                                      disabled={returning === issue.id}
                                      onClick={() => handleReturn(issue.id)}
                                      className="h-7 text-xs"
                                   >
                                     {returning === issue.id
                                        ? <Loader2 className="w-3 h-3 animate-spin"/>
                                        : "Return"
                                     }
                                   </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                       ))}
                       </tbody>
                     </table>
                   </div>
                   <Pagination page={page} totalPages={totalPages}
                               total={total} size={size} onPageChange={setPage}/>
                 </>
              )}
         </CardContent>
       </Card>
       
       <IssueBookDialog
          open={showIssue}
          onOpenChange={setShowIssue}
          onSuccess={() => {
            setShowIssue(false);
            fetchIssues();
          }}
       />
     </div>
  );
}

// ── Overdue Tab ───────────────────────────────────────────────────────────────
function OverdueTab () {
  const { isAdmin, isTeacher } = useAuthStore();
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  
  const fetchOverdue = async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getOverdue();
      setOverdue(res.data ?? []);
    } catch { toast.error("Failed to fetch overdue"); } finally { setLoading(false); }
  };
  
  useEffect(() => { fetchOverdue(); }, []);
  
  const handleReturn = async (id) => {
    setReturning(id);
    try {
      await libraryApi.returnBook(id);
      toast.success("Book returned");
      fetchOverdue();
    } catch { toast.error("Failed to return"); } finally { setReturning(null); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={6}/> :
              overdue.length === 0 ? (
                 <EmptyState icon={BookOpen}
                             title="No overdue books 🎉"
                             description="All books have been returned on time."/>
              ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm">
                     <thead className="bg-red-50 dark:bg-red-900/20">
                     <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                       <th className="text-left px-4 py-3 font-medium">Book</th>
                       <th className="text-left px-4 py-3 font-medium">Student</th>
                       <th className="text-left px-4 py-3 font-medium">Issue Date</th>
                       <th className="text-left px-4 py-3 font-medium">Due Date</th>
                       <th className="text-left px-4 py-3 font-medium">Days Overdue</th>
                       <th className="text-left px-4 py-3 font-medium">Fine (₹)</th>
                       <th className="text-right px-4 py-3 font-medium">Actions</th>
                     </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                     {overdue.map((issue) => {
                       const daysOverdue = Math.floor(
                          (new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24)
                       );
                       return (
                          <tr key={issue.id}
                              className="hover:bg-red-50/50 dark:hover:bg-red-900/10">
                            <td className="px-4 py-3 font-medium">{issue.bookTitle}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {issue.studentName}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDate(issue.issueDate)}
                            </td>
                            <td className="px-4 py-3 text-red-600 font-medium">
                              {formatDate(issue.dueDate)}
                            </td>
                            <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            {daysOverdue} days
                          </span>
                            </td>
                            <td className="px-4 py-3 text-red-600 font-semibold">
                              {formatCurrency(issue.fineAmount ?? daysOverdue * 2)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                {(isAdmin || isTeacher) && (
                                   <Button size="sm" variant="outline"
                                           disabled={returning === issue.id}
                                           onClick={() => handleReturn(issue.id)}
                                           className="h-7 text-xs">
                                     {returning === issue.id
                                        ? <Loader2 className="w-3 h-3 animate-spin"/>
                                        : "Return"
                                     }
                                   </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                       );
                     })}
                     </tbody>
                   </table>
                 </div>
              )}
         </CardContent>
       </Card>
     </div>
  );
}

// ── Fines Tab ─────────────────────────────────────────────────────────────────
function FinesTab () {
  const { isAdmin } = useAuthStore();
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const [status, setStatus] = useState("");
  
  const fetchFines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getFines({ status: status || undefined });
      setFines(res.data?.data ?? res.data ?? []);
    } catch { toast.error("Failed to fetch fines"); } finally { setLoading(false); }
  }, [status]);
  
  useEffect(() => { fetchFines(); }, [fetchFines]);
  
  const handlePayFine = async (issueId) => {
    setPaying(issueId);
    try {
      await libraryApi.payFine(issueId);
      toast.success("Fine paid successfully");
      fetchFines();
    } catch { toast.error("Failed to mark fine as paid"); } finally { setPaying(null); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       <div className="flex gap-3">
         <Select value={status} onValueChange={setStatus}>
           <SelectTrigger className="w-40">
             <SelectValue placeholder="All Status"/>
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All</SelectItem>
             <SelectItem value="PENDING">Unpaid</SelectItem>
             <SelectItem value="PAID">Paid</SelectItem>
           </SelectContent>
         </Select>
       </div>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={5}/> :
              fines.length === 0 ? (
                 <EmptyState icon={BookOpen}
                             title="No fines found"
                             description="No fines match your filter."/>
              ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm">
                     <thead className="bg-gray-50 dark:bg-gray-800/50">
                     <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                       <th className="text-left px-4 py-3 font-medium">Student</th>
                       <th className="text-left px-4 py-3 font-medium">Book</th>
                       <th className="text-left px-4 py-3 font-medium">Fine Amount</th>
                       <th className="text-left px-4 py-3 font-medium">Status</th>
                       <th className="text-right px-4 py-3 font-medium">Actions</th>
                     </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                     {fines.map((fine) => (
                        <tr key={fine.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="px-4 py-3 font-medium">
                            {fine.studentName}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {fine.bookTitle}
                          </td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            {formatCurrency(fine.fineAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                               status={fine.finePaid ? "PAID" : "PENDING"}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              {!fine.finePaid && isAdmin && (
                                 <Button size="sm" variant="outline"
                                         disabled={paying === fine.id}
                                         onClick={() => handlePayFine(fine.id)}
                                         className="h-7 text-xs">
                                   {paying === fine.id
                                      ? <Loader2 className="w-3 h-3 animate-spin"/>
                                      : "Mark Paid"
                                   }
                                 </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                     ))}
                     </tbody>
                   </table>
                 </div>
              )}
         </CardContent>
       </Card>
     </div>
  );
}

// ── Book Form Dialog ──────────────────────────────────────────────────────────
function BookFormDialog ({ open, onOpenChange, editData, onSuccess }) {
  const [form, setForm] = useState({
    title: "", author: "", isbn: "", publisher: "",
    publishedYear: "", totalCopies: "", category: "", description: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title ?? "",
        author: editData.author ?? "",
        isbn: editData.isbn ?? "",
        publisher: editData.publisher ?? "",
        publishedYear: String(editData.publishedYear ?? ""),
        totalCopies: String(editData.totalCopies ?? ""),
        category: editData.category ?? "",
        description: editData.description ?? "",
      });
    } else {
      setForm({
        title: "", author: "", isbn: "", publisher: "",
        publishedYear: "", totalCopies: "", category: "", description: "",
      });
    }
  }, [editData, open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handle = (k) => (e) => set(k, e.target.value);
  
  const handleSave = async () => {
    if (!form.title || !form.author || !form.totalCopies) {
      toast.error("Title, author and copies are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        author: form.author,
        isbn: form.isbn || undefined,
        publisher: form.publisher || undefined,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        totalCopies: Number(form.totalCopies),
        category: form.category || undefined,
        description: form.description || undefined,
      };
      editData
         ? await libraryApi.updateBook(editData.id, payload)
         : await libraryApi.createBook(payload);
      toast.success(editData ? "Book updated" : "Book added");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children, className = "" }) => (
     <div className={`space-y-1.5 ${className}`}>
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-lg">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Book" : "Add New Book"}</DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Title *" className="col-span-2">
             <Input placeholder="e.g. Introduction to Physics"
                    value={form.title} onChange={handle("title")}/>
           </F>
           <F label="Author *">
             <Input placeholder="e.g. H.C. Verma"
                    value={form.author} onChange={handle("author")}/>
           </F>
           <F label="ISBN">
             <Input placeholder="978-3-16-148410-0"
                    value={form.isbn} onChange={handle("isbn")}/>
           </F>
           <F label="Publisher">
             <Input placeholder="Publisher name"
                    value={form.publisher} onChange={handle("publisher")}/>
           </F>
           <F label="Published Year">
             <Input type="number" min="1900" max={new Date().getFullYear()}
                    placeholder="2020"
                    value={form.publishedYear} onChange={handle("publishedYear")}/>
           </F>
           <F label="Total Copies *">
             <Input type="number" min="1" placeholder="5"
                    value={form.totalCopies} onChange={handle("totalCopies")}/>
           </F>
           <F label="Category">
             <Input placeholder="e.g. Science, Fiction"
                    value={form.category} onChange={handle("category")}/>
           </F>
           <F label="Description" className="col-span-2">
             <Textarea placeholder="Brief description..." rows={2}
                       value={form.description} onChange={handle("description")}/>
           </F>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {editData ? "Update" : "Add Book"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

// ── Issue Book Dialog ─────────────────────────────────────────────────────────
function IssueBookDialog ({ open, onOpenChange, onSuccess }) {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [form, setForm] = useState({
    bookId: "", studentId: "", issueDate: "", dueDate: "",
  });
  const [saving, setSaving] = useState(false);
  
  const debouncedBook = useDebounce(bookSearch, 400);
  
  useEffect(() => {
    if (!open) return;
    // Load available books
    libraryApi.getBooks({
      available: true, page: 1, size: 100,
      search: debouncedBook || undefined
    })
       .then((res) => setBooks(res.data?.data ?? []));
  }, [open, debouncedBook]);
  
  useEffect(() => {
    if (!open) return;
    studentApi.getAll({ status: "ACTIVE", page: 1, size: 200 })
       .then((res) => setStudents(res.data?.data ?? []));
  }, [open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const handleSave = async () => {
    const { bookId, studentId, issueDate, dueDate } = form;
    if (!bookId || !studentId || !issueDate || !dueDate) {
      toast.error("All fields are required");
      return;
    }
    if (new Date(dueDate) <= new Date(issueDate)) {
      toast.error("Due date must be after issue date");
      return;
    }
    setSaving(true);
    try {
      await libraryApi.issueBook({
        bookId: Number(bookId),
        studentId: Number(studentId),
        issueDate,
        dueDate,
      });
      toast.success("Book issued successfully");
      setForm({ bookId: "", studentId: "", issueDate: "", dueDate: "" });
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to issue book");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children }) => (
     <div className="space-y-1.5">
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Issue Book</DialogTitle>
         </DialogHeader>
         <div className="space-y-4 py-2">
           <F label="Search & Select Book *">
             <Input placeholder="Search books..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}/>
             {books.length > 0 && (
                <Select value={form.bookId} onValueChange={(v) => set("bookId", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select book"/>
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((b) => (
                       <SelectItem key={b.id} value={String(b.id)}>
                         {b.title} ({b.availableCopies} copies)
                       </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             )}
           </F>
           
           <F label="Student *">
             <Select value={form.studentId} onValueChange={(v) => set("studentId", v)}>
               <SelectTrigger><SelectValue placeholder="Select student"/></SelectTrigger>
               <SelectContent>
                 {students.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.firstName} {s.lastName}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           
           <div className="grid grid-cols-2 gap-4">
             <F label="Issue Date *">
               <Input type="date" value={form.issueDate}
                      onChange={(e) => set("issueDate", e.target.value)}/>
             </F>
             <F label="Due Date *">
               <Input type="date" value={form.dueDate}
                      onChange={(e) => set("dueDate", e.target.value)}/>
             </F>
           </div>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             Issue Book
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

function TableSkeleton ({ cols = 5 }) {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
               <Skeleton key={j} className="h-4 flex-1"/>
            ))}
          </div>
       ))}
     </div>
  );
}