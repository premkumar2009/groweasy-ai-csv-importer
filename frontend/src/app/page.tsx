import { CsvImporterApp } from '../components/csv-importer-app';
import { ThemeToggle } from '../components/theme-toggle';

export default function HomePage() {
  return (
    <div className="pb-10">
      <div className="mx-auto flex max-w-7xl items-center justify-end px-4 pt-6 md:px-6 lg:px-8">
        <ThemeToggle />
      </div>
      <CsvImporterApp />
    </div>
  );
}