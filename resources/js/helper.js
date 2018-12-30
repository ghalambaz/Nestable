
 /* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame 2)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 2.01
 * Date: 10/24/13
 * Time: 3:21 PM
*/
 function showMessageWarning( txt  )
 {
     $.jGrowl(txt, {
         theme:  'Warning',
         position: 'top-left',
         speed:  'slow',
         header: 'Message',
         life:3000,
         speed: 1000,
         animateOpen: {
             height: 'show',
             width: 'show'
         },
         animateClose: {
             height: 'hide',
             width: 'show'
         }
     });

 }

 function showMessageError( txt  )
 {
     $.jGrowl(txt , {
         theme:  'error',
         position: 'top-left',
         speed:  'slow',
         header: 'Message',
         life:3000,
         speed: 1000,
         animateOpen: {
             height: 'show',
             width: 'show'
         },
         animateClose: {
             height: 'hide',
             width: 'show'
         }
     });

 }

 function showMessageSuccess( txt  )
 {
     $.jGrowl(txt, {
         theme:  'success',
         position: 'top-left',
         speed:  'slow',
         header: 'Message',
         life:3000,
         speed: 1000,
         animateOpen: {
             height: 'show',
             width: 'show'
         },
         animateClose: {
             height: 'hide',
             width: 'show'
         }
     });

 }

 function showMessageInfo(txt)
 {
     $.jGrowl(txt, {
         theme:  'info',
         position: 'top-left',
         speed:  'slow',
         header: 'Message',
         life:3000,
         speed: 1000,
         animateOpen: {
             height: 'show',
             width: 'show'
         },
         animateClose: {
             height: 'hide',
             width: 'show'
         }
     });

 }