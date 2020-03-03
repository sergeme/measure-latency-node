const data = [
    {
        'host':"www",
        'entries': [
            {
                'endpoint': "www",
                'timings': {
                    'total': 150
                }
            },{
                'endpoint': "eu",
                'timings': {
                    'total': 140
                }
            },{
                'endpoint': "cdn",
                'timings': {
                    'total': 165
            }
            },{
                'endpoint': "emea",
                'timings': {
                    'total': 135
            }
        }]
    },
    {
        'host':"eu",
        'entries': [
            {
                'endpoint': "www",
                'timings': {
                    'total': 150
                }
            },{
                'endpoint': "eu",
                'timings': {
                    'total': 140
                }
            },{
                'endpoint': "cdn",
                'timings': {
                    'total': 165
            }
            },{
                'endpoint': "emea",
                'timings': {
                    'total': 135
            }
        }]
    },
    {
        'host':"cdn",
        'entries': [
            {
                'endpoint': "www",
                'timings': {
                    'total': 150
                }
            },{
                'endpoint': "eu",
                'timings': {
                    'total': 140
                }
            },{
            'endpoint': "cdn",
            'timings': {
                'total': 165
            }
        },{
            'endpoint': "emea",
            'timings': {
                'total': 135
            }
        }]
    },
    {
        'host':"emea",
        'entries': [
            {
                'endpoint': "www",
                'timings': {
                    'total': 150
                }
            },{
                'endpoint': "eu",
                'timings': {
                    'total': 140
                }
            },{
            'endpoint': "cdn",
            'timings': {
                'total': 165
            }
        },{
            'endpoint': "emea",
            'timings': {
                'total': 135
            }
        }]
    }
]

module.exports = data