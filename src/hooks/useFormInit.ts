"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FORM_CONTROL_SELECTOR =
    'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"]), textarea, select';

type FormControlElement =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

function isFilled(el: FormControlElement): boolean {
    return el.value.length > 0 || el.matches(":-webkit-autofill");
}

function syncFilled(el: FormControlElement): void {
    const inputWrap = el.closest(".input");
    if (inputWrap) inputWrap.classList.toggle("filled", isFilled(el));
}

export function syncFormControlsFilled(root: ParentNode | Element = document): void {
    root.querySelectorAll(FORM_CONTROL_SELECTOR).forEach((el) => {
        syncFilled(el as FormControlElement);
    });
}

export function useFormInit() {
    const pathname = usePathname();

    useEffect(() => {
        const onInvalid = (e: Event) => {
            e.preventDefault();
        };

        document.addEventListener("invalid", onInvalid, true);

        const fieldFocusHandlers = new Map<Element, () => void>();
        document.querySelectorAll(".field").forEach((field) => {
            const handler = () => {
                const siblings = field.parentElement
                    ? Array.from(field.parentElement.children)
                    : [];
                siblings.forEach((el) => el.classList.remove("focusin"));
                field.classList.add("focusin");
            };
            field.addEventListener("focusin", handler);
            fieldFocusHandlers.set(field, handler);
        });

        const formElements = document.querySelectorAll(FORM_CONTROL_SELECTOR);
        const controlHandlers = new Map<
            Element,
            {
                focusin: () => void;
                focusout: () => void;
                input: () => void;
                change: () => void;
            }
        >();

        formElements.forEach((el) => {
            const control = el as FormControlElement;
            const focusin = () => {
                const inputWrap = el.closest(".input");
                if (inputWrap) inputWrap.classList.add("filled");
            };
            const focusout = () => syncFilled(control);
            const input = () => syncFilled(control);
            const change = () => syncFilled(control);

            el.addEventListener("focusin", focusin);
            el.addEventListener("focusout", focusout);
            el.addEventListener("input", input);
            el.addEventListener("change", change);
            controlHandlers.set(el, { focusin, focusout, input, change });
        });

        const updateCtaWidths = () => {
            document.querySelectorAll(".input").forEach((input) => {
                const button = input.querySelector(":scope > .cta");
                if (!button) return;
                input.classList.add("input--cta");
                (input as HTMLElement).style.setProperty(
                    "--cta-width",
                    `${Math.ceil((button as HTMLElement).offsetWidth)}px`,
                );
            });
        };

        updateCtaWidths();
        window.addEventListener("resize", updateCtaWidths);

        const filledTimeout = window.setTimeout(() => {
            formElements.forEach((el) => syncFilled(el as FormControlElement));
        }, 100);

        if (!document.documentElement.classList.contains("is-device")) {
            document.querySelectorAll(".date-device").forEach((dateInput) => {
                dateInput.setAttribute("type", "text");
                dateInput.classList.add("date");
                dateInput.classList.remove("date-device");
            });
        }

        document.querySelectorAll(".date-device").forEach((dateInput) => {
            const datepicker = dateInput.closest(".datepicker");
            if (datepicker) datepicker.classList.add("datepicker-device");
        });

        return () => {
            document.removeEventListener("invalid", onInvalid, true);
            fieldFocusHandlers.forEach((handler, field) => {
                field.removeEventListener("focusin", handler);
            });
            controlHandlers.forEach(({ focusin, focusout, input, change }, el) => {
                el.removeEventListener("focusin", focusin);
                el.removeEventListener("focusout", focusout);
                el.removeEventListener("input", input);
                el.removeEventListener("change", change);
            });
            window.removeEventListener("resize", updateCtaWidths);
            window.clearTimeout(filledTimeout);
        };
    }, [pathname]);
}
