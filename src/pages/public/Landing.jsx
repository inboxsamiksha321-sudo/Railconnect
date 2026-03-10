import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Train, Shield, Clock, Users, ChevronRight, Star } from 'lucide-react'

const slides = [
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80',
  'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1600&q=80',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAKgAsgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQACAwEGB//EAEIQAAIBAwICBwUFBgQFBQAAAAECAwAEERIhMUEFEyJRYXGBFDKRobEGI0JS8BUzksHR4VRigvEkU2Ny0kOjssLi/8QAGQEAAgMBAAAAAAAAAAAAAAAAAQIAAwQF/8QAJxEAAgICAgICAQQDAAAAAAAAAAECEQMSITEEE0FRIhQyYYEFI1L/2gAMAwEAAhEDEQA/APPJHEMasb+NXaOMe6QnlS5pB2tTjbhXM6jtnzzVtmKxn1KcNeT3CutHGnvOPjS2I6fLuzXDOPzK9HYCYzWJSwGojPM1aSGNeMp/hFKmuQVALMMVDcOmN9QPA0LGbQ1KZzpZdvCqsGU9lVIpbDcMqlnYYPDarrNPhSpRg1RyoTsOeR0GUUGsFvW/GuaokkxbCSBj+UVkeuL5yCOeOVSMkyMLW4iYbD0xVzcJzBXyoVJJ3OY4ST/27VvD0feXWNKIB3tkAeHCo8kV2wGiyBffLA92oVXrQeBYnOMZra3spurwns0p7y53oKZHt7zTdAocfu1kxQWWL6YGggSBf3hwe4iuiRDsGAPcKDcxyXAjaGYsezuwz9K3fq4JOqljmibGdOkN880d0+A6mrMnNiPOoAzDCkAeJxWQaM5w07Y44tyf/tUMluvC46v/AL0I/mamwfWyPLHE+hjk8z3VrpBUMHLKeYoKS3Esm17Ax7hqGfiK16udIeyU0Lx0yLj60HZNJfQasUDxFmdgw/ABx9aq0NqYskSa/BtqUvcacrlvA5q63BCbtnPdSJt/ItB/V2v+Hb+I1KC6z/Kf4qlNz9i0LJlkefRGAdQyu/Gt4oXji0yZ442OfpR/RrQ9Is8UxCoF45A+FcvYba21JbHWQO2S3CqfbzqXCuVnAyBt50Ks+ngD6UT1qmTq9CsPAb1o9pEDgxuvlVu1dg6MPaWfn8qLtZmR87sDwBxtXLXox7j9yUBB4OcVpfdHywIglMcbHgNR7XyoeyN1YGdiYSNqdOeMDga5NPEXxpcAcAeFUkh0oFaYBlG+DnPlVoo0TZ5Cx8BwpJSREca4l09g5XOMgbVqsoddTscYz2ds1aWFZFC6l3HBj2h8KHkhZIfeB2x2XB+lRNNBNvbhnR95jvDDA+VQ3bK+g48GxgE+VCW9pIy63JWPOAdGrPjWzIscidZ2lHukEDP1qfgA01EqAW054Y3qTh2IZusZjw1GumWNEEkcYDPxYUMekWjdlJVjQvnhEDre9ezizK2rI3VxsO4gVJriS9bLysMkZyKVS3gm3kA/1cKzFxIcdWeNDVt2E9D0deHo793iQN7ysuQf1muzdOSs2mUxIeeUBxXn5p51tjq7JOxI50MgkdTrdhj0zSPHzYybPSx9J20h6sx27jxUAn1xQdzcRO5S3t9Lnhpwc0j6qQ3KouSScArj506gtcSAGePVtrwaDWnLYbYvuJbtWy6kDv4j4ivR9A2PtHRF7dXblUjj1ROE31f04f2oeMC4kwpKLHnV4gct81639nJf/Y5FsIWSURlTpbZmBzjjzx86vwy2Q8cex47739A/0rtX1n/mH41KOk/sr0BOi797KKWMwHXIMF+GRvWLTGbd9yck476MiIdD1hbQOAVxv5VVxBjGSJAMrqbOPOqtlbYDOx6Kmu5GdXGlTghzg+hqdJW8trgMVBK52YnajLS7msu1I50EbKzDB8tqrcXUE8glkUZXbbIPxzSeye9/BAS2l6pQCHZ9JOW/DjkP0at0jeG5SLrMxuFxkbk+ZrF17WqA4zuWxv31aGSIjW40yA4yvD4VH3sSjK2urgOI44i5HLRnNMhrYZ1BF/Jkg0A9+M6G1Ad7D/aqT3JVxGmSpGd6jtgRa7QaziQh8ZCA6l/nXUnnRcICE+FRbmGNR1xHWE+6u2K3juIrsiIchxAAwPhtTO0EFuJ2lIGQSw4auFRFuI1PVvlD+HJx8efrW1zELPU0ax4JxnUSR5UKvSE7SBUXWW4DG5qKWytAoIMo0hRqUjkFyKxk6OScnTJhjyxj5UxtxL70uiM/lU7msnuF6zPVqT3k0m7vgIObGK3TE8etu8nb4CrrJFoCGIFRyxXJLliudRHcO+tLXrJJMuFRORcYBoSk9bkyUBX8KvbgqrGNTliO6gWeRpRFDGxAOF017ULFpHVuy/59PvVnLFGJHcpF2hsVTc/EVnj5i6oNCSzsTDG3XSoGbgBwz4VeKCKI4VWln5BuAposJkw8SNq5EncDzroigjcLJNpkONhjbz2pf1F9kAraaZll60nUg2GOFe2+ydxL+yriMuREt2xUjGfdHf6V5mO0VpmittUrS74B3J7q9n0f0Q9j0cqT3AjZSXfSmwJxnz4csV08DuCaNsFURZP9nraWeSTJGti2McMnzqVw3sYJHtEe3/T/AP1UrTwJweHN+5cLJIHjH4WOfrXWuogmIY1CHYnA/nSVSCdUhOKPhNtJHpJZWxwI2rE4mQKSP2rSxYsqcMDAFZXFhcPkphVPDUcVV70rH1UL6V5FRVrW9ld9DsWTvJJxSPZELJby2x30nYjIzVLdEd/vQwj947cfAUwaeNV2OFrGLQ7s0mWVO0BnjSbtoJY3EK4OFVTgjA3rKe5s5mCSoGwMaskGtf2gmgrkomMYP64UnnnTV2Rx54xUjHZkOdIxKsmtBiJsbneto5FtotEIwCMEniaJsLnRCZHK4OAF4g0UILC4OpYlQ7dqM7eWOHyqyWSuKIDRwyyIBdYVSMjI3PlW1tFaxZeNW1HmTWsscSrsDJk++W+VZ+yjqwSyoDw1Zqlz4IdknTGlWVR4ChDGXcKj6s8guTRE9jqTERwc4yV2Hwra1tEVSF7R4g+98tyKCnGK4ICW9nK7+7kjv503iAht01n7zYkqNs8xvxG9Cz3LhOrjtZn7OduGPLhVYoJ3gMkkpj0rqWI7jHdmqpzc1y6ChhmGJzLK6u3iv03q0cRujrUKqd5ztXLZIBIVm+9GRpUrsD416S36KurmJJFUQpj3nXGfQ5PyxWTWcnrBWMk2Jn6rqxGjuoB3ZfqTQSfZ6W9kxaPI54htGFU+Jr2CWnRlmrPcP7U44iQlQPELS69+1e5gsYQ2OATgv69a6Hj+DOL2m6GUA/o2zt/s7B10462404aVtgB4dw8aX9MdPNfJ1duWSIE6m55HIUjvrq6vIpmuJ8nq2YRKdhsfj+tqwubhLS369yFSMHQi7ZJJro8JVEu2aVDFIQUUlUBI3zUrxb9N9IM7MJX3OalSmJsMp+jUc5RdBxjbhQYtJg5jaJmC8GJxRC9KIymMbEDO9bW3SAYKrkEHjprCpZIrkzGcfRKltVxJp2zpTlWMNlcJdkJGSg21+FN5Vi1DQCzE7A7elUuI541IxgEZIU5x51Ws0vkNAk0BK4Lb+FZSwTxxqIhkA5IHGtCxByy9rurnWSFs40+tMpSAXijZjqmgWNu8kGtpIbWQqWTWV4H9CsdQcZwreuK4ZtJxgr60j2sJ2To6OU5QMMDYHgaxa0uotkQAdwNbo4b3WA8zXGZ1/wDUBo7y+SC2aa6gfTIjA9x4UVZzPcSIr6kYnAwcH0FFkq8Q65ldTyrWz6Pa4lZrK0eeQ7HC5CeI7vjR2TXQUm+goSLFHid20e7hsENtzODWFz1bOsMMCtp3GghUHmOdem6M+ydwiB7uXqN8nHab5Y+tPbXonouzQkxLLj8Uozn04fKlh405Mujhm1bPFWVv0le6Ba28s+rgyLhR/qO3zp5F9kr65Cm/u0hU7MqDUx9f96a9I/afo6wGGlDt+SP+1ebvvtb0hdFo7GMW6HbW3H0rXDw4RdyGUIRPRt0b0b0Wiy+0GBgPfdY//GvOXv2hPtDQWhSdjusq5j28Rk0iuHeeYe2XLyya1TDMDgnhtWESnrUYHbqw2eHNht8K0xUYL8EHth17cyXAWXpO7LaQWESnAwBnzNZPP926QIMxyiMseQKMc/ELS5LNvbZ57mQSaywCg52ztk+W2BWV/wBKpCfu8SSOdlXhmlqT7C5JdBszLY2c7O5YsCM+YOQP60nup5Ok7lUUnQNyvIHxocTzX8pCHW3Nvy+XdTe2txapoQZc7k8808UI2VFgn5Pkala6rn86VKmzJRky2E0jRJE6SRn3+J9c5pglvahVJAU4z93L2vnS22ktLcLLcSapW3wAABV55bZXSSMuVbsjS+5Nc5qT4KBgpssgp1ux4syg+m1VuCWRWjlPVFuyDivKT3TvLscBST2Sf6046NuJJ1kt2bCv+Y59TQli1VjUETXKrGNiSeYFDpMdOyFlzjxrS4imjjBjIcDuq1rbpb/ePJ1jY27Ow9aCaSFoy6yZ1wtvpxxztWns124LlQoHjmiDdY90Hb5VRLkJKwMcjAnGRq+Zx9SKsjGbfCHUWYwo4bG5PhTCLo55Shn9ogjPF/ZHbHltj41V7m6ihecrJYwqMmVndiR3gUVYfaDpHK+zN7Sirkalx1g5kMDgeRAq/wBC7kXxxp9jnoe2+y0bdu6NxMm5NyGVQfIjHxJr1Jvbe1iBHVxx4wNGAPTH8q8X0v0v0b0nZwo0GqaUaomGxT15eleVtr2WeziE8ssik6VXOF9auhGH0WZP9XR9B6R+19vAxS1++l5aP515296W6S6Qzrl6pTxEf8zSxfuRFqjUa3xpYkd24HM78/jXY0a4YiTfq5QSJEHZ2z3beu/jTOVOkJGMprZui6tHGVx2iW0ajsQTxOf/ABrNZ5ZlURoG1I+Sq4HPAP8Ac48KtBEjOY2fURrlLA4A0qWx48OAxQdx0gsEYV2CDOQi7fSjq/krnnhDiCsMit1V0aeX3erZUTbSVHwxk8B8e4NryJJY1By6xgaB/q+GM0subq5ucqitEnPcZx8dqGEDTXC9QmWA95cgfHv8flUaoCU5cyDukLmSWIFJOqhZiC3NgOOO/wBKpa2DTIFQdXDnfPFvP+nCjbToxYysk5Ekg4d1MYxqB6sA4/CKjaStjpUYWskViwVGC+Z40e2LoRvGEAbdiOOaxuIob2AwTRKhB1Lgb57qZdF9CosSrO5kTkrAH61zMvlRT3v+gxaTtgnsb/4t/wCFa5XpvZLT81Sub+vkN7Y/R886q2Ll3yc+4ukDHpWV3hIoyrMyat2OAVPlQLTsTl8gjc7caHacuRnZRyB+tdlQ5MqQeFQ3JDLq147Q2FG9HQLBcnLMS2QBg8KwsQrSBur1AY3Db+eK9f0TZolsk1uQGlzhnbTpxy8KErnLRFkIRlxJ0ivRv2c6UuWB0CJTwaU4yPLjTy0+ylvBL1kpilk/6p2+GPrmlDm9thMXFrO8mGGDnqznGpe7GRWVqOloUQpMxPWFjJG5B54XHD5Uy8dx+DVh9CfMkekuugFfeWzhk5HqwCR9DXmLlrOKV4LC2FtMp2aVOPfnfs+uRThPtJNaWpiv9TuX0RlQMsfHG3I715a+upen7iG7mdYYSvaReLbnGT/P5VbF0jXPFHjUYQ/aBHjeOSFZp02xGcKPE93jjPpQSIWRzoihiZtZhhTSufHv9fTFbWdnCkWmPRFGCMtnLE/Un9bUwngNr0ctzCEUHGksfvGz3d3pv40ry30KsNcsR2cBVej5JcxqigkHnknlSropj1Vpn9yG1Ecs5POj7Z2aO1LOxcovEZzz9OVK7CVIbJBI2CuTp58asxLnky+XOkqH99cwTSqQhk0kkZOADt/SgLrpDTHquJcAHZe7yFLJr937EalfPzx9aGntyZgZpG+rH+lXNxj+0wuE8tbsKTpETyBE1qOHZG7bULIC+kcZFVQQp3yOJJ/pRVtZPMNMaCKE+9knJ8zzpxbWcNsB1ahmH4jtnypdrLowjHiKF9p0XNL27lsIPwcM02hhihULGAoNaSL1ajrRpU8C21XY2jw645RIyjOjvqueWONDllt2ZdSPG4zjsmpBZ3DXI6rqGXGSWG9DxOiXRbU8YA/c7EfEUWOlYVwZMAk8jXOzZ8v7RZOhrZ9HW0MnWyyPlt9BXIBpvpcKXjRJR3DiKTJLDfRK0b9sjLDI2rkMk1q+pHLZ5E8PWuXLG59lTkM/bx/hWqVh+3G/w/yrlJ6n/wAi2fMVROsTXJkE4wdvqact0THLo6uSNIxwVNvmTtTX9go5Qy6WSNDpiAwpPecVyToi5eUSBo4l5hjuN+X+9diflRfTGuhf0f0PNExR5dSsuR4EetemMKrBFb6ZMJGFIAyAcZJ3I/QoSCzMIGnJ37RDk6qAZpHuJYpIGlUMdKpu8YznskcvDhtUwZ5ezZGzxPGh5GyyMdxWxMTtCraZEZCzDhkHcj4cM0D+zpuqZQ8enOWbS+P/AI+NCrJc9QfZ77MZIzI8xQxnuwTt6Zqj3Bjwz3F5cv4OyR/HifTFbo+dPng1ZP8AB+PSe1BHSsEkiWUMRDdThyBnLc9hx4k1S1hhsbUxlusZAyYGOHcTv8F+NDSX1xOpRiFQjdE7OfM8T6muQuJYC5fsMSwbPH05/TyqraWS9i+cYYajH4GLSGWReZT92q8P6Y+tC3k8cSgXE5cqNCpqxj/L4eXGgvb1nMns8i6AdLS559wA4/TxpTexRPLnWesYacsdWRjGQKeMEjHkzORpP0jrCRwJ1USOoXbfgceVKYtZTK4VdGnUyjfvx30Q/VKAiIJSObcNhgUVb2Ulw2qVvXhj0qzozvnsFhM0rKEHaAwDjfhy7uFN7LopEfXNxHLOx86LtreOAYRd+/vrftHuNOCiHCDQAMZxgV2NkBH3qK+MgMNq1ht3lBHZB45Y4HxrWboVryBOueRWQjDxqufgSf5Vk8jPGP4piydGF/dSxqiPBHJGRgFW0/CsejuiIJSXIcAk51b5HqKY2fRdray67pnkIxjOMn0yRT2B4mXCQLp4d+1c7Jn0VR5Fc0kKV6DiCHqnVufZQDTXmulei762kMgTXHy0cfhXtbm9jtZ0iiQRmXZsNwFbSRPjWuGXwqjH5E4u5FTkzzX2ZkiIdJky7ADJ7qcXFlJEdcR1p3V0wW82CYwGP4ohhh6UwhKRqYnlIPcWBpcuT8tkhRP95/yT8P7VKalVzw/9wVKnuf0QRlOkGPaljUZ/NyrvshI7VwurzzQlxPJpzH2uWPCheukwSNWsdmrFBscY+yiPOq6LY5V5q46UuIbp9ccsczcQJiNh5g7UZPfdVkSsATyrCTDwdldAKaxDMNSkcew38jitvjRcLcjZ40JSToDXpKEBUe3lxjIwwNbL0uPu9LXA6lgyKApCkHjxpfcEhzph0YPawDsKLtoVkjRo44WO+qSUkBQRttzPGtjUVyXxy5pvWzZr+JLZ2RnEpPZ6xQceOAcfGgbu8lu2jyXAY7qpxjHf+h6Va9aOOWFFlefCsSSuAM/l7htQskyjUkAJD7MScnFPFJoqyylvUjS0ujDE7SKS7vkE8/SuDrLqUksd+J5n+1ctrYySdrJJ5mm0ECRDYb+VMiopZ2KRYZhnPLFMUwOXoKxVySNWcDuNaA52G5+lH+Q8G4IFbRKCyhSNyBnj9KHJUA5ZRjfBHOiredkYQwszv7wTPLnsKzZstRqIsnQaVgjJW0VNaAdrJJHpn9YqlxcTlg7mNT35ILZ7s4zQ7pcqRqEMIYnSpO+frS++nlimUK5bWcchr9BXP03fJnbtjuI28seuWdGcciuB6msnv5raQLrRu9Qdl+NKpZjGyyADQeGWOR/L4VWR2YxuCZVJ4Z5/Gp6vsA2uI2u5ElSYNlhkZ3HzrWK/nt2KSMQR+E8KX2d4usKyEdoZBBDGiJhDK4KSsF5hlBpXFdNECpLxZT7QhMcg2bfjQZvFWR3LlvBSBn5VjMREpMbhlPLH8qW3Ds7hkBC8+AqRgiDv9pONg0OBw7LVKV9XF3NUpvTEgTM7KpIGCO6lkl22TqLByScKaKkumkDgAjzocEDGlNbngcVpw4n8l0YfZiIz+8mIBxsTxIolelksrcRTxl485Un3s94oOW6BOiIrLN35yi+Xefl41yOwLt1k2ppPzMGwB8BgfrateiqjRGTj0dTpmyyuqObAyDpA4Z8+5iPRTVz0zYkAyWbPg6u0gxk7njnA3Py7qFMSTSaUjQ54yEbUTFZoPeXJ7zU9aY6zzS4FNxNc3sxZweGAAMYHd86JtrI6suMeVNFiSMdkDNVJXmtOuOCp23bKqoVcKK6DtnbFVzXAcjSDuKItGwzjfuzjNMLcW5twJgC7cTwNJnb8TAagMACsZp57hiVwNP8AmqjLc1wRhU0rE9WkrPp4ZGwouCMRW4llA6xz7zcscqD6Pgud5CNiOLb0bLLEgIdldvKs+V/CEnJG7zhbZMtLGMghkP8AbJ9aFM8PVD/PsJGC5B9KW3N1GXywbB7jXDcQxsikrIxGCxXhnuqRhZR8hoeDQC51D8oAGOHOjI5nCaLeTXpOUUqMV56SZ+sy8hPHBBxiuxT9WQ4489+NO4DUMRd/8QxlQmTO+cA+tELdnXpXtN4caUQvrZnJZic5PfVjct1mSNuGRxxSvHYKGc922ntMBy0ht/pQssh1gFgc8jwq8cvXDtZ1cM9wrMwpI+AVBPDOKCikApmbvPwNSifYr38ifxVKPBCk0qqoedikZ90Di3l3+fCqpHPdpho2hhPIA9rzbG/lsPCu1K2pUawvRBYw6ncKudkUcfIBx8cbUM7SXvZYCODjoG+fE99SpUCboirsoCr3VxpccKlSiQzMmaqTtnlXKlS+LId3yBjcjNaSTy2GQ1urFxgnlUqVnnNtAbB3kNywyujJxnlRsFpbq4WUB5O5RtUqVnytrhCyNrhVmj+7bRvtyBpXPZyh9TEZ5YGM1KlJjlRnYJcxPjOkAUEylcbcKlStcR0WL5GkgVooUtjO1cqU1DUFWo0yZAJXuomS2V4+wpzUqVTN0xGaWi9X74J8qlwxMiGJPTArlSku2KW/4j84/iFcqVKlEP/Z',
  'data:image/jpeg;base64,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',
  
  
]

const stats = [
  { label: 'Complaints Resolved', value: '2.4L+' },
  { label: 'Active Users',        value: '18L+'  },
  { label: 'Resolution Rate',     value: '98%'   },
  { label: 'Avg Resolution Time', value: '3 Days'},
]

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'AI-Powered Routing',
    desc: 'Smart complaint routing to the right department using trained AI models.',
    color: 'bg-blue-50 text-rail-mid',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Real-Time Tracking',
    desc: 'Track your complaint status in real-time with live updates.',
    color: 'bg-orange-50 text-rail-accent',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Multilingual Support',
    desc: 'File complaints in any of the 22 Indian languages.',
    color: 'bg-green-50 text-rail-green',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Voice & Photo',
    desc: 'Submit complaints via voice recording or photo evidence.',
    color: 'bg-purple-50 text-purple-600',
  },
]

const Landing = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">

        {/* Slideshow */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === current ? 1 : 0,
              backgroundImage: `url(${slide})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-rail-blue/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Train className="w-4 h-4 text-rail-accent" />
            <span className="text-white text-sm font-dm">Indian Railways · Smart Complaint Platform</span>
          </div>
          <h1 className="font-syne font-bold text-white text-5xl md:text-6xl mb-4 leading-tight">
            Your Voice,<br />
            <span className="text-rail-accent">Our Priority</span>
          </h1>
          <p className="text-blue-100 font-dm text-lg mb-8 max-w-2xl mx-auto">
            File, track and resolve railway complaints instantly.
            Powered by AI for smarter, faster resolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 bg-rail-accent hover:bg-orange-500 text-white font-dm font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              File a Complaint <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/track"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-dm font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all"
            >
              Track Complaint
            </Link>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-rail-accent w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Stats */}
      <div className="bg-rail-blue py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-syne font-bold text-rail-accent text-3xl">{stat.value}</p>
                <p className="text-blue-200 font-dm text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-rail-bg py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-syne font-bold text-rail-blue text-3xl mb-2">
              Why RailConnect?
            </h2>
            <p className="text-rail-gray font-dm">
              Built for 1.4 billion Indians, powered by technology
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-syne font-bold text-rail-blue mb-2">{f.title}</h3>
                <p className="text-rail-gray text-sm font-dm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-rail-blue py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-syne font-bold text-white text-3xl mb-4">
            Ready to file your complaint?
          </h2>
          <p className="text-blue-200 font-dm mb-8">
            Join 18 lakh+ passengers who trust RailConnect
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-rail-accent hover:bg-orange-500 text-white font-dm font-semibold px-8 py-3.5 rounded-xl transition-all"
          >
            Get Started Free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Landing