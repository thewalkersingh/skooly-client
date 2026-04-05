import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Library, BookOpen, RotateCcw } from "lucide-react";
import { libraryApi } from "@/services/libraryApi";
import { studentApi } from "@/services/studentApi";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import BookFormModal from "./BookFormModal";
import IssueBookModal from "./IssueBookModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";
import "./library.css";
// import "@/pages/classes/classes.css";

const ISSUE_STATUS_BADGE = {
  ISSUED: "badge badge-warning",
  RETURNED: "badge badge-success",
  OVERDUE: "badge badge-danger",
};

export default function LibraryPage () {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;
  const { toasts, toast } = useToast();
  
  const [tab, setTab] = useState("books");
  
  // Books state
  const [books, setBooks] = useState([]);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookSearch, setBookSearch] = useState("");
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [bookSaving, setBookSaving] = useState(false);
  const [bookDeleting, setBookDeleting] = useState(false);
  
  // Issues state
  const [issues, setIssues] = useState([]);
  const [issueLoading, setIssueLoading] = useState(true);
  const [issueSearch, setIssueSearch] = useState("");
  const [issueFormOpen, setIssueFormOpen] = useState(false);
  const [deleteIssue, setDeleteIssue] = useState(null);
  const [issueSaving, setIssueSaving] = useState(false);
  const [issueDeleting, setIssueDeleting] = useState(false);
  const [returning, setReturning] = useState(null);
  
  // Students dropdown for issue form
  const [students, setStudents] = useState([]);
  
  // fetch students for dropdown
  useEffect(() => {
    studentApi.getAll(schoolId)
       .then((res) => setStudents(Array.isArray(res.data) ? res.data : res.data.content ?? []))
       .catch(() => {});
  }, [schoolId]);
  
  // ── fetch books ────────────────────────────────────────
  const fetchBooks = useCallback(async (q) => {
    setBookLoading(true);
    try {
      const res = await libraryApi.getAllBooks(schoolId, q);
      setBooks(Array.isArray(res.data) ? res.data : res.data.content ?? []);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setBookLoading(false);
    }
  }, [schoolId]);
  
  // ── fetch issues ───────────────────────────────────────
  const fetchIssues = useCallback(async (q) => {
    setIssueLoading(true);
    try {
      const res = await libraryApi.getAllIssues(schoolId, q);
      setIssues(Array.isArray(res.data) ? res.data : res.data.content ?? []);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setIssueLoading(false);
    }
  }, [schoolId]);
  
  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  
  useEffect(() => {
    const t = setTimeout(() => fetchBooks(bookSearch), 300);
    return () => clearTimeout(t);
  }, [bookSearch, fetchBooks]);
  
  useEffect(() => {
    const t = setTimeout(() => fetchIssues(issueSearch), 300);
    return () => clearTimeout(t);
  }, [issueSearch, fetchIssues]);
  
  // ── Book handlers ──────────────────────────────────────
  const handleBookSubmit = async (payload) => {
    setBookSaving(true);
    try {
      if (editBook) {
        await libraryApi.updateBook(schoolId, editBook.id, payload);
        toast({ message: "Book updated successfully" });
      } else {
        await libraryApi.createBook(schoolId, payload);
        toast({ message: "Book added successfully" });
      }
      setBookFormOpen(false);
      fetchBooks(bookSearch);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setBookSaving(false);
    }
  };
  
  const handleBookDelete = async () => {
    setBookDeleting(true);
    try {
      await libraryApi.deleteBook(schoolId, deleteBook.id);
      toast({ message: "Book deleted successfully" });
      setDeleteBook(null);
      fetchBooks(bookSearch);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setBookDeleting(false);
    }
  };
  
  // ── Issue handlers ─────────────────────────────────────
  const handleIssueSubmit = async (payload) => {
    setIssueSaving(true);
    try {
      await libraryApi.issueBook(schoolId, payload);
      toast({ message: "Book issued successfully" });
      setIssueFormOpen(false);
      fetchIssues();
      fetchBooks(); // refresh available copies
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setIssueSaving(false);
    }
  };
  
  const handleReturn = async (issue) => {
    setReturning(issue.id);
    try {
      await libraryApi.returnBook(schoolId, issue.id);
      toast({ message: "Book returned successfully" });
      fetchIssues();
      fetchBooks();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setReturning(null);
    }
  };
  
  const handleIssueDelete = async () => {
    setIssueDeleting(true);
    try {
      await libraryApi.deleteIssue(schoolId, deleteIssue.id);
      toast({ message: "Record deleted successfully" });
      setDeleteIssue(null);
      fetchIssues();
      fetchBooks();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setIssueDeleting(false);
    }
  };
  
  return (
     <div>
       <div className="page-header-row">
         <div>
           <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)" }}>
             Library</h2>
           <p style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4 }}>
             Manage books, inventory, and issue/return records.
           </p>
         </div>
         <button
            className="btn btn-primary"
            onClick={tab === "books" ? () => {
              setEditBook(null);
              setBookFormOpen(true);
            } : () => setIssueFormOpen(true)}
         >
           <Plus/> {tab === "books" ? "Add Book" : "Issue Book"}
         </button>
       </div>
       
       {/* Tabs */}
       <div className="tabs">
         <button className={`tab-btn${tab === "books" ? " active" : ""}`}
                 onClick={() => setTab("books")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Library style={{ width: 15, height: 15 }}/> Books ({books.length})
          </span>
         </button>
         <button className={`tab-btn${tab === "issues" ? " active" : ""}`}
                 onClick={() => setTab("issues")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BookOpen style={{ width: 15, height: 15 }}/> Issued ({issues.length})
          </span>
         </button>
       </div>
       
       {/* ── Books tab ── */}
       {tab === "books" && (
          <>
            <div className="toolbar">
              <div className="search-input-wrapper">
                <Search/>
                <input
                   className="search-input"
                   placeholder="Search by title, author, ISBN..."
                   value={bookSearch}
                   onChange={(e) => setBookSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                  <tr>
                    <th>Book</th>
                    <th>Category</th>
                    <th>Publisher</th>
                    <th>Year</th>
                    <th>Availability</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {bookLoading ? (
                     <tr>
                       <td colSpan={6} style={{ textAlign: "center", padding: 40 }}>
                         <div className="spinner" style={{ margin: "0 auto" }}/>
                       </td>
                     </tr>
                  ) : books.length === 0 ? (
                     <tr>
                       <td colSpan={6}>
                         <div className="empty-state">
                           <Library/>
                           <strong>No books found</strong>
                           <p>{bookSearch ?
                              "Try a different search term." : "Add your first book to get started."}</p>
                         </div>
                       </td>
                     </tr>
                  ) : books.map((b) => {
                    const pct = b.totalCopies > 0 ? (b.availableCopies / b.totalCopies) * 100 : 0;
                    return (
                       <tr key={b.id}>
                         <td>
                           <div className="book-title-cell">
                             <div className="book-cover"><Library/></div>
                             <div>
                               <div className="title">{b.title}</div>
                               <div className="isbn">{b.author ?? "—"}{b.isbn ? " · " + b.isbn : ""}</div>
                             </div>
                           </div>
                         </td>
                         <td>{b.category
                            ? <span className="badge badge-primary">{b.category}</span>
                            : <span style={{ color: "var(--gray-400)" }}>—</span>}
                         </td>
                         <td>{b.publisher ?? "—"}</td>
                         <td>{b.publishedYear ?? "—"}</td>
                         <td>
                           <div className="copies-bar">
                             <div className="copies-bar-track">
                               <div className={`copies-bar-fill${b.availableCopies === 0 ? " low" : ""}`}
                                    style={{ width: pct + "%" }}/>
                             </div>
                             <span style={{
                               fontSize: "var(--font-size-xs)",
                               color: b.availableCopies === 0 ? "var(--danger)" : "var(--gray-600)"
                             }}>
                              {b.availableCopies}/{b.totalCopies}
                            </span>
                           </div>
                         </td>
                         <td>
                           <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                             <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => {
                               setEditBook(b);
                               setBookFormOpen(true);
                             }}>
                               <Pencil style={{ width: 15, height: 15 }}/>
                             </button>
                             <button className="btn btn-ghost btn-icon"
                                     title="Delete"
                                     style={{ color: "var(--danger)" }}
                                     onClick={() => setDeleteBook(b)}>
                               <Trash2 style={{ width: 15, height: 15 }}/>
                             </button>
                           </div>
                         </td>
                       </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
       )}
       
       {/* ── Issues tab ── */}
       {tab === "issues" && (
          <>
            <div className="toolbar">
              <div className="search-input-wrapper">
                <Search/>
                <input
                   className="search-input"
                   placeholder="Search by book or student..."
                   value={issueSearch}
                   onChange={(e) => setIssueSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                  <tr>
                    <th>Book</th>
                    <th>Student</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {issueLoading ? (
                     <tr>
                       <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                         <div className="spinner" style={{ margin: "0 auto" }}/>
                       </td>
                     </tr>
                  ) : issues.length === 0 ? (
                     <tr>
                       <td colSpan={7}>
                         <div className="empty-state">
                           <BookOpen/>
                           <strong>No issue records found</strong>
                           <p>{issueSearch ? "Try a different search term."
                              : "Issue a book to a student to get started."}</p>
                         </div>
                       </td>
                     </tr>
                  ) : issues.map((issue) => (
                     <tr key={issue.id}>
                       <td style={{ fontWeight: 500 }}>{issue.bookTitle}</td>
                       <td>{issue.studentName}</td>
                       <td>{issue.issueDate ?? "—"}</td>
                       <td>{issue.dueDate ?? "—"}</td>
                       <td>{issue.returnDate ??
                          <span style={{ color: "var(--gray-400)" }}>Not returned</span>}</td>
                       <td>
                         <span className={ISSUE_STATUS_BADGE[issue.status] || "badge badge-gray"}>
                           {issue.status}</span>
                       </td>
                       <td>
                         <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                           {issue.status === "ISSUED" && (
                              <button
                                 className="btn btn-ghost btn-icon"
                                 title="Mark as Returned"
                                 style={{ color: "var(--success)" }}
                                 disabled={returning === issue.id}
                                 onClick={() => handleReturn(issue)}
                              >
                                {returning === issue.id
                                   ? <div className="spinner" style={{ width: 14, height: 14 }}/>
                                   : <RotateCcw style={{ width: 15, height: 15 }}/>}
                              </button>
                           )}
                           <button className="btn btn-ghost btn-icon"
                                   title="Delete" style={{ color: "var(--danger)" }}
                                   onClick={() => setDeleteIssue(issue)}>
                             <Trash2 style={{ width: 15, height: 15 }}/>
                           </button>
                         </div>
                       </td>
                     </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
       )}
       
       {/* Modals */}
       <BookFormModal
          open={bookFormOpen}
          onClose={() => setBookFormOpen(false)}
          onSubmit={handleBookSubmit}
          initial={editBook}
          loading={bookSaving}
       />
       
       <IssueBookModal
          open={issueFormOpen}
          onClose={() => setIssueFormOpen(false)}
          onSubmit={handleIssueSubmit}
          books={books}
          students={students}
          loading={issueSaving}
       />
       
       <ConfirmDialog
          open={!!deleteBook}
          onClose={() => setDeleteBook(null)}
          onConfirm={handleBookDelete}
          loading={bookDeleting}
          title="Delete Book"
          message={"Are you sure you want to delete \"" + (deleteBook?.title ?? "") + "\"?"}
       />
       
       <ConfirmDialog
          open={!!deleteIssue}
          onClose={() => setDeleteIssue(null)}
          onConfirm={handleIssueDelete}
          loading={issueDeleting}
          title="Delete Issue Record"
          message="Are you sure you want to delete this issue record?"
       />
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}