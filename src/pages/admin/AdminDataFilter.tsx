import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldValues, Path, useForm } from 'react-hook-form';

interface AdminDataFilterItem<SearchDataType extends FieldValues> {
  name: Path<SearchDataType>;
  label: string;
}

export default function AdminDataFilter<SearchDataType extends FieldValues>({
  onSubmit,
  onReset,
  items,
}: {
  onSubmit: (data: SearchDataType) => void;
  onReset: () => void;
  items: AdminDataFilterItem<SearchDataType>[];
}) {
  const form = useForm<SearchDataType>();

  return (
    <form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-[10px] items-end">
        {items.map((item) => (
          <div key={item.name} className="flex flex-col gap-[5px]">
            <Label htmlFor={item.name}>{item.label}</Label>
            <Input className="w-[200px]" id={item.name} type="text" {...form.register(item.name)} />
          </div>
        ))}
        <Button type="submit">검색</Button>
        <Button type="reset" variant="outline" onClick={onReset}>
          초기화
        </Button>
      </div>
    </form>
  );
}
