import { Button as PrimaryButton } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default () => {
    return (
        <Dialog>
            <DialogTrigger render={<PrimaryButton />}>Open Modal</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Greetings</DialogTitle>
                    <DialogDescription className="p-4 text-xl">Hello @servicestack/vue!</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
