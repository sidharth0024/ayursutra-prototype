 import { clsx, type ClassValue } from "clsx"
 import { twMerge } from "tailwind-merge"
 export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs))
 }
 export function formatDate(date: string | Date) {
 return new Intl.DateTimeFormat('en-IN', {
 dateStyle: 'medium',
 timeStyle: 'short'
 }).format(new Date(date))
 }
 export function formatTime(date: string | Date) {
 return new Intl.DateTimeFormat('en-IN', {
 timeStyle: 'short'
 }).format(new Date(date))
 }
 export function formatCurrency(amount: number) {
 return new Intl.NumberFormat('en-IN', {
 style: 'currency',
 currency: 'INR'
 }).format(amount)
 }
 export function generateId() {
 return Math.random().toString(36).substr(2, 9)
 }
 export function debounce&lt;T extends (...args: any[]) =&gt; void&gt;(
 func: T,
 delay: number
 ): (...args: Parameters&lt;T&gt;) =&gt; void {
 let timeoutId: NodeJS.Timeout
 return (...args: Parameters&lt;T&gt;) =&gt; {
 clearTimeout(timeoutId)
 timeoutId = setTimeout(() =&gt; func(...args), delay)
 }
 }
