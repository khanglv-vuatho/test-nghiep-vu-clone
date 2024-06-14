import { Radio, RadioGroup } from '@nextui-org/react'
import { useState } from 'react'

// export default function TestPage() {
//   const [groupSelected, setGroupSelected] = React.useState([])

//   return (
//     <div className='flex w-full flex-col gap-1'>
//       <CheckboxGroup
//         value={groupSelected}
//         onChange={setGroupSelected as any}
//         classNames={{
//           base: 'w-full e',
//           wrapper: 'w-full'
//         }}
//       >
//         <CustomCheckbox
//           groupSelected={groupSelected}
//           value='junior'
//           user={{
//             name: 'Junior Garcia',
//             avatar: 'https://avatars.githubusercontent.com/u/30373425?v=4',
//             username: 'jrgarciadev',
//             url: 'https://twitter.com/jrgarciadev',
//             role: 'Software Developer',
//             status: 'Active'
//           }}
//           statusColor='secondary'
//         />
//         <CustomCheckbox
//           groupSelected={groupSelected}
//           value='johndoe'
//           user={{
//             name: 'John Doe',
//             avatar: 'https://i.pravatar.cc/300?u=a042581f4e29026707d',
//             username: 'johndoe',
//             url: '#',
//             role: 'Product Designer',
//             status: 'Vacation'
//           }}
//           statusColor='warning'
//         />
//         <CustomCheckbox
//           groupSelected={groupSelected}
//           value='zoeylang'
//           user={{
//             name: 'Zoey Lang',
//             avatar: 'https://i.pravatar.cc/300?u=a042581f4e29026704d',
//             username: 'zoeylang',
//             url: '#',
//             role: 'Technical Writer',
//             status: 'Out of office'
//           }}
//           statusColor='danger'
//         />
//         <CustomCheckbox
//           value='william'
//           groupSelected={groupSelected}
//           user={{
//             name: 'William Howard',
//             avatar: 'https://i.pravatar.cc/300?u=a048581f4e29026701d',
//             username: 'william',
//             url: '#',
//             role: 'Sales Manager',
//             status: 'Active'
//           }}
//           statusColor='secondary'
//         />
//       </CheckboxGroup>
//       <p className='ml-1 mt-4 text-default-500'>Selected: {groupSelected.join(', ')}</p>
//     </div>
//   )
// }
// const CustomCheckbox = ({ user, statusColor, value, groupSelected }: any) => {
//   const isActive = groupSelected.includes(value)
//   return (
//     <Checkbox
//       aria-label={user.name}
//       classNames={{
//         label: 'w-full',
//         wrapper: 'hidden',
//         base: 'w-full max-w-max'
//       }}
//       value={value}
//     >
//       <div className={`flex w-full justify-between gap-2 border-1 transition duration-150 ${isActive ? 'border-primary-blue' : 'border-transparent'}`}>
//         <User avatarProps={{ size: 'md', src: user.avatar }} description={<p>@{user.username}</p>} name={user.name} />
//         <div className='flex flex-col items-end gap-1'>
//           <span className='text-tiny text-default-500'>{user.role}</span>
//           <Chip color={statusColor} size='sm' variant='flat'>
//             {user.status}
//           </Chip>
//         </div>
//       </div>
//     </Checkbox>
//   )
// }

export default function TestPage() {
  const [selected, setSelected] = useState('')
  const data = [
    'Luôn nói xấu về đồng nghiệp để củng cố vị trí của mình.',
    'Sydney',
    'Luôn nói xấu về đồng nghiệp để củng cố vị trí của mình.',
    'London',
    'Luôn nói xấu về đồng nghiệp để củng cố vị trí của mình.'
  ]

  return (
    <RadioGroup
      classNames={{
        base: '1',
        label: '2',
        description: '3',
        errorMessage: '4',
        wrapper: '5 gap-10 flex-auto w-full'
      }}
      label='Select your favorite city'
      value={selected}
      className=''
      onValueChange={setSelected}
    >
      {data.map((value) => {
        const isActive = selected === value
        return (
          <Radio
            classNames={{
              base: `6 w-full p-4 flex rounded-xl transition ${isActive ? 'bg-primary-blue' : ''}`,
              label: `7 ${isActive ? 'text-white' : 'text-primary-black'}`,
              description: '8',
              control: '9',
              labelWrapper: 'm-0',
              wrapper: 'hidden'
            }}
            style={{
              width: '100%',
              maxWidth: '100%'
            }}
            key={value}
            value={value}
          >
            {value}
          </Radio>
        )
      })}
    </RadioGroup>
  )
}
