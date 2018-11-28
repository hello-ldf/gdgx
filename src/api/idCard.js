import request from '@/utils/request'

export function readCard(call) {
  request.get('http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&READTYPE=1', null)
    .then(response => { call() })
}

