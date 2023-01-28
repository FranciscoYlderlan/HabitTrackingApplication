import * as CheckBox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';

interface CheckboxProps extends CheckBox.CheckboxProps {
    title: string;
}

export function Checkbox ( { title, checked = false, disabled = false, ...rest } : CheckboxProps ) {

    return (
        <CheckBox.Root
            className='flex items-center gap-3 group disabled:cursor-not-allowed focus:outline-none'
            checked={checked}
            disabled = {disabled}
            {...rest}
        >
            <div 
                className='h-8 w-8  rounded-lg  flex items-center border-2 
                justify-center bg-zinc-900 border-zinco-800 group-data-[state=checked]:bg-green-500
                group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 
                group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900'
            >
                <CheckBox.Indicator>
                    <Check size={20} className="text-white"/>
                </CheckBox.Indicator>
            </div>
            
            <span className='font-semibold text-xl  text-white  leading-tight group-data-[state=checked]:line-through
                group-data-[state=checked]:text-zinc-400'
            >
                {title}
            </span>
        </CheckBox.Root>
    )
}