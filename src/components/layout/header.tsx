"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NAV_LINKS, INSTITUTION } from "@/lib/constants";

const PORTAL_URL = "https://ava05.eduno.com.br";

export function Header() {
  const [open, setOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-light.png"
              alt={`${INSTITUTION.name} — ${INSTITUTION.slogan}`}
              width={240}
              height={67}
              sizes="180px"
              className="h-12 w-auto sm:h-14"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => setPortalOpen(true)}
            >
              Já sou aluno
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent-dark" asChild>
              <Link href="/cursos">Matricule-se</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                <Button
                  variant="outline"
                  className="w-full text-primary border-primary"
                  onClick={() => {
                    setOpen(false);
                    setPortalOpen(true);
                  }}
                >
                  Já sou aluno
                </Button>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-dark mt-2" asChild>
                  <Link href="/cursos" onClick={() => setOpen(false)}>
                    Matricule-se
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Portal do Aluno Modal */}
      <Dialog open={portalOpen} onOpenChange={setPortalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 gap-0">
          <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light px-8 py-10 text-center">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-accent" />
            </div>

            <DialogTitle className="text-xl font-bold text-white sm:text-2xl">
              Portal do Aluno {INSTITUTION.name}
            </DialogTitle>

            <DialogDescription className="mt-3 text-sm text-white/70 leading-relaxed">
              Ao clicar no link abaixo você será redirecionado ao seu Ambiente
              Virtual de Aprendizagem.
            </DialogDescription>

            {/* CTA */}
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:bg-white/90 hover:scale-105 active:scale-100"
            >
              <GraduationCap className="h-4 w-4" />
              PORTAL DO ALUNO
              <ExternalLink className="h-3.5 w-3.5 opacity-50" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
