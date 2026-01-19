export default function Footer() {
    return (
        <footer className="border-t bg-white dark:bg-zinc-950 mt-auto">
            <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 py-6 px-4 sm:px-6 lg:px-8 md:h-20 md:flex-row md:py-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2024 E-Shop Inc. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                </div>
            </div>
        </footer>
    )
}
