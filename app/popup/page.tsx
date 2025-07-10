import { generatePopupMetadata } from '../../lib/metadata';

export const metadata = generatePopupMetadata();

export default function PopupPage() {
    // This page is typically used for modal content
    return (
        <main>
            <p>This page is used for popup/modal content.</p>
        </main>
    );
}