import { tags, useTodoItems } from './TodoItemsContext'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { useState } from 'react'

const useInputStyles = makeStyles(() => ({
    root: {
        marginBottom: 24,
    },
}))

export default function TodoItemForm() {
    const classes = useInputStyles()
    const { dispatch } = useTodoItems()
    const { control, handleSubmit, reset, watch } = useForm()
    const [tagId, setTagId] = useState('')

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTagId(event.target.value as string)
    }
    return (
        <form
            onSubmit={handleSubmit((formData) => {
                dispatch({ type: 'add', data: { todoItem: formData } })
                reset({ title: '', details: '', tag: '' })
                setTagId('')
            })}
        >
            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="TODO"
                        fullWidth={true}
                        className={classes.root}
                    />
                )}
            />
            <Controller
                name="details"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Details"
                        fullWidth={true}
                        multiline={true}
                        className={classes.root}
                    />
                )}
            />
            <FormControl fullWidth={true}>
                <InputLabel id="demo-simple-select-label1">Add tag</InputLabel>
                <Controller
                    name="tag"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange } }) => (
                        <Select
                            labelId="demo-simple-select-label1"
                            id="demo-simple-select"
                            fullWidth={true}
                            className={classes.root}
                            value={tagId}
                            onChange={(e) => {
                                onChange(e)
                                handleChange(e)
                            }}
                        >
                            {tags.map((tag) =>
                                tag.id !== '0' ? (
                                    <MenuItem value={tag.id} key={tag.id}>
                                        {tag.name}
                                    </MenuItem>
                                ) : null
                            )}
                        </Select>
                    )}
                />
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!watch('title')}
            >
                Add
            </Button>
        </form>
    )
}
